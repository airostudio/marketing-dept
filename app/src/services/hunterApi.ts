// Hunter.io API Service
// Documentation: https://hunter.io/api-documentation/v2

const HUNTER_API_BASE_URL = 'https://api.hunter.io/v2';

export interface DomainSearchParams {
  domain: string;
  limit?: number;
  offset?: number;
  type?: 'personal' | 'generic';
  seniority?: string[];
  department?: string[];
}

export interface EmailFinderParams {
  domain: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  linkedin_url?: string;
}

export interface EmailVerifierParams {
  email: string;
}

export interface LeadParams {
  email?: string;
  first_name?: string;
  last_name?: string;
  position?: string;
  company?: string;
  phone_number?: string;
  linkedin_url?: string;
  twitter?: string;
}

export interface CampaignParams {
  name: string;
  leads?: string[]; // Array of lead IDs
}

export interface EmailAddress {
  value: string;
  type: string;
  confidence: number;
  sources: Array<{
    domain: string;
    uri: string;
    extracted_on: string;
    last_seen_on: string;
    still_on_page: boolean;
  }>;
  first_name: string;
  last_name: string;
  position: string;
  seniority: string;
  department: string;
  linkedin: string;
  twitter: string;
  phone_number: string;
  verification?: {
    date: string;
    status: string;
  };
}

export interface DomainSearchResult {
  data: {
    domain: string;
    disposable: boolean;
    webmail: boolean;
    accept_all: boolean;
    pattern: string;
    organization: string;
    emails: EmailAddress[];
  };
  meta: {
    results: number;
    limit: number;
    offset: number;
    params: {
      domain: string;
      type?: string;
    };
  };
}

export interface EmailFinderResult {
  data: {
    first_name: string;
    last_name: string;
    email: string;
    score: number;
    domain: string;
    accept_all: boolean;
    position: string;
    twitter: string;
    linkedin_url: string;
    phone_number: string;
    company: string;
    sources: Array<{
      domain: string;
      uri: string;
      extracted_on: string;
      last_seen_on: string;
      still_on_page: boolean;
    }>;
    verification?: {
      date: string;
      status: string;
    };
  };
  meta: {
    params: {
      first_name?: string;
      last_name?: string;
      full_name?: string;
      domain: string;
      company?: string;
    };
  };
}

export interface EmailVerifierResult {
  data: {
    status: 'valid' | 'invalid' | 'accept_all' | 'webmail' | 'disposable' | 'unknown';
    result: string;
    score: number;
    email: string;
    regexp: boolean;
    gibberish: boolean;
    disposable: boolean;
    webmail: boolean;
    mx_records: boolean;
    smtp_server: boolean;
    smtp_check: boolean;
    accept_all: boolean;
    block: boolean;
    sources: Array<{
      domain: string;
      uri: string;
      extracted_on: string;
      last_seen_on: string;
      still_on_page: boolean;
    }>;
  };
  meta: {
    params: {
      email: string;
    };
  };
}

export interface Lead {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  position: string;
  company: string;
  phone_number: string;
  linkedin_url: string;
  twitter: string;
  confidence_score: number;
  created_at: string;
}

export interface Campaign {
  id: number;
  name: string;
  leads_count: number;
  created_at: string;
  updated_at: string;
}

class HunterApiService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeRequest<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    const queryParams = new URLSearchParams({
      api_key: this.apiKey,
      ...Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== undefined && v !== null)
      ),
    });

    const url = `${HUNTER_API_BASE_URL}${endpoint}?${queryParams}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ errors: [{ details: response.statusText }] }));
        throw new Error(error.errors?.[0]?.details || `API request failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Hunter API Error: ${error.message}`);
      }
      throw new Error('Unknown error occurred while calling Hunter API');
    }
  }

  /**
   * Domain Search - Find all email addresses for a domain
   * Free endpoint, no credits used
   */
  async domainSearch(params: DomainSearchParams): Promise<DomainSearchResult> {
    const requestParams: Record<string, any> = {
      domain: params.domain,
    };

    if (params.limit) requestParams.limit = params.limit;
    if (params.offset) requestParams.offset = params.offset;
    if (params.type) requestParams.type = params.type;
    if (params.seniority?.length) requestParams.seniority = params.seniority.join(',');
    if (params.department?.length) requestParams.department = params.department.join(',');

    return this.makeRequest<DomainSearchResult>('/domain-search', requestParams);
  }

  /**
   * Email Finder - Find the most likely email address for a person
   * Costs 1 credit per call
   */
  async findEmail(params: EmailFinderParams): Promise<EmailFinderResult> {
    return this.makeRequest<EmailFinderResult>('/email-finder', params);
  }

  /**
   * Email Verifier - Verify the deliverability of an email address
   * Costs 0.5 credit per call
   */
  async verifyEmail(params: EmailVerifierParams): Promise<EmailVerifierResult> {
    return this.makeRequest<EmailVerifierResult>('/email-verifier', params);
  }

  /**
   * Get account information including remaining requests
   */
  async getAccountInfo(): Promise<any> {
    return this.makeRequest('/account');
  }

  /**
   * Create a new lead
   */
  async createLead(params: LeadParams): Promise<{ data: Lead }> {
    const formData = new FormData();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    const response = await fetch(`${HUNTER_API_BASE_URL}/leads?api_key=${this.apiKey}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ errors: [{ details: response.statusText }] }));
      throw new Error(error.errors?.[0]?.details || `Failed to create lead: ${response.status}`);
    }

    return await response.json();
  }

  /**
   * Get all leads
   */
  async getLeads(offset = 0, limit = 100): Promise<{ data: { leads: Lead[] }; meta: any }> {
    return this.makeRequest('/leads', { offset, limit });
  }

  /**
   * Get a specific lead
   */
  async getLead(leadId: number): Promise<{ data: Lead }> {
    return this.makeRequest(`/leads/${leadId}`);
  }

  /**
   * Update a lead
   */
  async updateLead(leadId: number, params: Partial<LeadParams>): Promise<{ data: Lead }> {
    const formData = new FormData();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    const response = await fetch(`${HUNTER_API_BASE_URL}/leads/${leadId}?api_key=${this.apiKey}`, {
      method: 'PUT',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ errors: [{ details: response.statusText }] }));
      throw new Error(error.errors?.[0]?.details || `Failed to update lead: ${response.status}`);
    }

    return await response.json();
  }

  /**
   * Delete a lead
   */
  async deleteLead(leadId: number): Promise<void> {
    const response = await fetch(`${HUNTER_API_BASE_URL}/leads/${leadId}?api_key=${this.apiKey}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete lead: ${response.status}`);
    }
  }

  /**
   * Create a new campaign
   */
  async createCampaign(params: CampaignParams): Promise<{ data: Campaign }> {
    const formData = new FormData();
    formData.append('name', params.name);

    if (params.leads && params.leads.length > 0) {
      params.leads.forEach(leadId => {
        formData.append('leads[]', leadId);
      });
    }

    const response = await fetch(`${HUNTER_API_BASE_URL}/campaigns?api_key=${this.apiKey}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ errors: [{ details: response.statusText }] }));
      throw new Error(error.errors?.[0]?.details || `Failed to create campaign: ${response.status}`);
    }

    return await response.json();
  }

  /**
   * Get all campaigns
   */
  async getCampaigns(offset = 0, limit = 100): Promise<{ data: { campaigns: Campaign[] }; meta: any }> {
    return this.makeRequest('/campaigns', { offset, limit });
  }

  /**
   * Get a specific campaign
   */
  async getCampaign(campaignId: number): Promise<{ data: Campaign }> {
    return this.makeRequest(`/campaigns/${campaignId}`);
  }

  /**
   * Update a campaign
   */
  async updateCampaign(campaignId: number, name: string, leadIds?: string[]): Promise<{ data: Campaign }> {
    const formData = new FormData();
    formData.append('name', name);

    if (leadIds && leadIds.length > 0) {
      leadIds.forEach(leadId => {
        formData.append('leads[]', leadId);
      });
    }

    const response = await fetch(`${HUNTER_API_BASE_URL}/campaigns/${campaignId}?api_key=${this.apiKey}`, {
      method: 'PUT',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ errors: [{ details: response.statusText }] }));
      throw new Error(error.errors?.[0]?.details || `Failed to update campaign: ${response.status}`);
    }

    return await response.json();
  }

  /**
   * Delete a campaign
   */
  async deleteCampaign(campaignId: number): Promise<void> {
    const response = await fetch(`${HUNTER_API_BASE_URL}/campaigns/${campaignId}?api_key=${this.apiKey}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete campaign: ${response.status}`);
    }
  }

  /**
   * Add leads to a campaign
   */
  async addLeadsToCampaign(campaignId: number, leadIds: string[]): Promise<{ data: Campaign }> {
    const formData = new FormData();
    leadIds.forEach(leadId => {
      formData.append('leads[]', leadId);
    });

    const response = await fetch(
      `${HUNTER_API_BASE_URL}/campaigns/${campaignId}/add_leads?api_key=${this.apiKey}`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({ errors: [{ details: response.statusText }] }));
      throw new Error(error.errors?.[0]?.details || `Failed to add leads to campaign: ${response.status}`);
    }

    return await response.json();
  }

  /**
   * Remove leads from a campaign
   */
  async removeLeadsFromCampaign(campaignId: number, leadIds: string[]): Promise<{ data: Campaign }> {
    const formData = new FormData();
    leadIds.forEach(leadId => {
      formData.append('leads[]', leadId);
    });

    const response = await fetch(
      `${HUNTER_API_BASE_URL}/campaigns/${campaignId}/remove_leads?api_key=${this.apiKey}`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({ errors: [{ details: response.statusText }] }));
      throw new Error(error.errors?.[0]?.details || `Failed to remove leads from campaign: ${response.status}`);
    }

    return await response.json();
  }
}

// Export a factory function to create the service with an API key
export function createHunterApiService(apiKey: string): HunterApiService {
  return new HunterApiService(apiKey);
}

export default HunterApiService;
