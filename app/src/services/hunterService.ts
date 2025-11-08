// Hunter Service - High-level service for Hunter worker operations
import { createHunterApiService } from './hunterApi';
import type {
  DomainSearchParams,
  EmailFinderParams,
  LeadParams,
  CampaignParams,
} from './hunterApi';

export interface HunterTaskResult {
  success: boolean;
  data?: any;
  error?: string;
}

export interface FindLeadsParams {
  domain?: string;
  company?: string;
  limit?: number;
  departments?: string[];
  seniorities?: string[];
}

export interface FindEmailParams {
  domain: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  linkedinUrl?: string;
}

export interface VerifyEmailsParams {
  emails: string[];
}

export interface CreateCampaignParams {
  name: string;
  leadEmails?: string[];
}

class HunterService {
  /**
   * Find leads for a company using domain search
   */
  static async findLeads(params: FindLeadsParams, apiKey: string): Promise<HunterTaskResult> {
    try {
      if (!apiKey) {
        return {
          success: false,
          error: 'Hunter.io API key is not configured',
        };
      }

      if (!params.domain) {
        return {
          success: false,
          error: 'Domain is required for lead search',
        };
      }

      const hunterApi = createHunterApiService(apiKey);

      const searchParams: DomainSearchParams = {
        domain: params.domain,
        limit: params.limit || 100,
      };

      if (params.departments && params.departments.length > 0) {
        searchParams.department = params.departments;
      }

      if (params.seniorities && params.seniorities.length > 0) {
        searchParams.seniority = params.seniorities;
      }

      const result = await hunterApi.domainSearch(searchParams);

      return {
        success: true,
        data: {
          domain: result.data.domain,
          organization: result.data.organization,
          emailsFound: result.data.emails.length,
          totalResults: result.meta.results,
          pattern: result.data.pattern,
          emails: result.data.emails.map(email => ({
            email: email.value,
            firstName: email.first_name,
            lastName: email.last_name,
            position: email.position,
            department: email.department,
            seniority: email.seniority,
            confidence: email.confidence,
            verified: email.verification?.status === 'valid',
          })),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to find leads',
      };
    }
  }

  /**
   * Find a specific person's email address
   */
  static async findEmail(params: FindEmailParams, apiKey: string): Promise<HunterTaskResult> {
    try {
      if (!apiKey) {
        return {
          success: false,
          error: 'Hunter.io API key is not configured',
        };
      }

      const hunterApi = createHunterApiService(apiKey);

      const finderParams: EmailFinderParams = {
        domain: params.domain,
      };

      if (params.firstName) finderParams.first_name = params.firstName;
      if (params.lastName) finderParams.last_name = params.lastName;
      if (params.fullName) finderParams.full_name = params.fullName;
      if (params.linkedinUrl) finderParams.linkedin_url = params.linkedinUrl;

      const result = await hunterApi.findEmail(finderParams);

      return {
        success: true,
        data: {
          email: result.data.email,
          firstName: result.data.first_name,
          lastName: result.data.last_name,
          position: result.data.position,
          company: result.data.company,
          confidence: result.data.score,
          verified: result.data.verification?.status === 'valid',
          sources: result.data.sources?.length || 0,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to find email',
      };
    }
  }

  /**
   * Verify a single email address
   */
  static async verifyEmail(email: string, apiKey: string): Promise<HunterTaskResult> {
    try {
      if (!apiKey) {
        return {
          success: false,
          error: 'Hunter.io API key is not configured',
        };
      }

      const hunterApi = createHunterApiService(apiKey);
      const result = await hunterApi.verifyEmail({ email });

      return {
        success: true,
        data: {
          email: result.data.email,
          status: result.data.status,
          score: result.data.score,
          valid: result.data.status === 'valid',
          acceptAll: result.data.accept_all,
          disposable: result.data.disposable,
          webmail: result.data.webmail,
          mxRecords: result.data.mx_records,
          smtpCheck: result.data.smtp_check,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to verify email',
      };
    }
  }

  /**
   * Verify multiple email addresses
   */
  static async verifyEmails(params: VerifyEmailsParams, apiKey: string): Promise<HunterTaskResult> {
    try {
      if (!apiKey) {
        return {
          success: false,
          error: 'Hunter.io API key is not configured',
        };
      }

      const hunterApi = createHunterApiService(apiKey);
      const results = await Promise.allSettled(
        params.emails.map(email => hunterApi.verifyEmail({ email }))
      );

      const verified = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      const emailResults = results.map((result, index) => {
        if (result.status === 'fulfilled') {
          return {
            email: result.value.data.email,
            status: result.value.data.status,
            score: result.value.data.score,
            valid: result.value.data.status === 'valid',
          };
        } else {
          return {
            email: params.emails[index],
            status: 'error',
            score: 0,
            valid: false,
            error: result.reason?.message || 'Verification failed',
          };
        }
      });

      const validEmails = emailResults.filter(r => r.valid).length;
      const validPercentage = params.emails.length > 0
        ? Math.round((validEmails / params.emails.length) * 100)
        : 0;

      return {
        success: true,
        data: {
          total: params.emails.length,
          verified,
          failed,
          valid: validEmails,
          validPercentage,
          results: emailResults,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to verify emails',
      };
    }
  }

  /**
   * Create a lead in Hunter
   */
  static async createLead(params: LeadParams, apiKey: string): Promise<HunterTaskResult> {
    try {
      if (!apiKey) {
        return {
          success: false,
          error: 'Hunter.io API key is not configured',
        };
      }

      const hunterApi = createHunterApiService(apiKey);
      const result = await hunterApi.createLead(params);

      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create lead',
      };
    }
  }

  /**
   * Get all leads
   */
  static async getLeads(apiKey: string, offset = 0, limit = 100): Promise<HunterTaskResult> {
    try {
      if (!apiKey) {
        return {
          success: false,
          error: 'Hunter.io API key is not configured',
        };
      }

      const hunterApi = createHunterApiService(apiKey);
      const result = await hunterApi.getLeads(offset, limit);

      return {
        success: true,
        data: result.data.leads,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get leads',
      };
    }
  }

  /**
   * Create a campaign
   */
  static async createCampaign(params: CreateCampaignParams, apiKey: string): Promise<HunterTaskResult> {
    try {
      if (!apiKey) {
        return {
          success: false,
          error: 'Hunter.io API key is not configured',
        };
      }

      const hunterApi = createHunterApiService(apiKey);

      // If leadEmails provided, first create leads then add to campaign
      let leadIds: string[] = [];

      if (params.leadEmails && params.leadEmails.length > 0) {
        const leadResults = await Promise.allSettled(
          params.leadEmails.map(email =>
            hunterApi.createLead({ email })
          )
        );

        leadIds = leadResults
          .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
          .map(r => r.value.data.id.toString());
      }

      const campaignParams: CampaignParams = {
        name: params.name,
        leads: leadIds.length > 0 ? leadIds : undefined,
      };

      const result = await hunterApi.createCampaign(campaignParams);

      return {
        success: true,
        data: {
          id: result.data.id,
          name: result.data.name,
          leadsCount: result.data.leads_count,
          createdAt: result.data.created_at,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create campaign',
      };
    }
  }

  /**
   * Get all campaigns
   */
  static async getCampaigns(apiKey: string, offset = 0, limit = 100): Promise<HunterTaskResult> {
    try {
      if (!apiKey) {
        return {
          success: false,
          error: 'Hunter.io API key is not configured',
        };
      }

      const hunterApi = createHunterApiService(apiKey);
      const result = await hunterApi.getCampaigns(offset, limit);

      return {
        success: true,
        data: result.data.campaigns,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get campaigns',
      };
    }
  }

  /**
   * Get account information
   */
  static async getAccountInfo(apiKey: string): Promise<HunterTaskResult> {
    try {
      if (!apiKey) {
        return {
          success: false,
          error: 'Hunter.io API key is not configured',
        };
      }

      const hunterApi = createHunterApiService(apiKey);
      const result = await hunterApi.getAccountInfo();

      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get account info',
      };
    }
  }
}

export default HunterService;
