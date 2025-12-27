/**
 * Production System Validator
 * Ensures the system has valid API keys before allowing any operations
 * NO FALLBACKS - Production-only system
 */

import { useEffect, useState } from 'react';
import { geminiService } from '../services/gemini';
import { deepseekService } from '../services/deepseek';
import { validateSystemConfiguration } from '../services/taskExecutor';
import { AlertTriangle, XCircle, CheckCircle, ExternalLink } from 'lucide-react';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  hasGemini: boolean;
  hasDeepSeek: boolean;
}

export default function ProductionValidator() {
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Validate system configuration on mount
    const result = validateSystemConfiguration();
    const hasGemini = geminiService.isConfigured();
    const hasDeepSeek = deepseekService.isConfigured();

    const validationResult: ValidationResult = {
      ...result,
      hasGemini,
      hasDeepSeek
    };

    setValidation(validationResult);

    // Show modal if system is not valid
    if (!result.isValid) {
      setShowModal(true);
    }
  }, []);

  if (!validation || validation.isValid) {
    return null; // System is valid, don't show anything
  }

  if (!showModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-red-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center gap-3">
            <XCircle className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Production System Not Configured</h2>
              <p className="text-red-100 mt-1">API keys required to operate</p>
            </div>
          </div>
        </div>

        {/* Errors */}
        {validation.errors.length > 0 && (
          <div className="p-6 border-b border-gray-200 bg-red-50">
            <h3 className="text-lg font-semibold text-red-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Critical Errors
            </h3>
            <ul className="space-y-2">
              {validation.errors.map((error, i) => (
                <li key={i} className="text-red-800 flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>{error}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Status */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                {validation.hasGemini ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="font-medium">Google Gemini API</span>
              </div>
              <span className={`text-sm ${validation.hasGemini ? 'text-green-600' : 'text-red-600'}`}>
                {validation.hasGemini ? 'Configured' : 'Not Configured'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                {validation.hasDeepSeek ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="font-medium">DeepSeek API</span>
              </div>
              <span className={`text-sm ${validation.hasDeepSeek ? 'text-green-600' : 'text-red-600'}`}>
                {validation.hasDeepSeek ? 'Configured' : 'Not Configured'}
              </span>
            </div>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Setup</h3>

          <div className="space-y-4">
            {/* Gemini Setup */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">1. Get Google Gemini API Key (FREE)</h4>
              <ol className="space-y-2 text-sm text-gray-700 mb-3">
                <li className="flex gap-2">
                  <span className="font-medium">a.</span>
                  <span>Visit Google AI Studio</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium">b.</span>
                  <span>Sign in with your Google account</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium">c.</span>
                  <span>Click "Create API Key"</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium">d.</span>
                  <span>Copy the key</span>
                </li>
              </ol>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
              >
                Get FREE Gemini API Key
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* DeepSeek Setup (Optional) */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h4 className="font-semibold text-gray-900 mb-2">2. Get DeepSeek API Key (Optional)</h4>
              <p className="text-sm text-gray-600 mb-3">
                DeepSeek is optional but recommended for analytical agents. Very affordable at $0.14/million tokens.
              </p>
              <a
                href="https://platform.deepseek.com/api_keys"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors text-sm"
              >
                Get DeepSeek API Key
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Configuration Instructions */}
            <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">3. Configure Your API Keys</h4>
              <p className="text-sm text-blue-800 mb-3">
                Add your API keys to the <code className="bg-blue-200 px-2 py-1 rounded text-xs">.env</code> file:
              </p>
              <pre className="bg-blue-900 text-blue-100 p-3 rounded text-xs font-mono overflow-x-auto">
{`# File: app/.env
VITE_GEMINI_API_KEY=your_gemini_key_here
VITE_DEEPSEEK_API_KEY=your_deepseek_key_here`}
              </pre>
              <p className="text-sm text-blue-800 mt-3">
                Then restart the development server: <code className="bg-blue-200 px-2 py-1 rounded text-xs">Ctrl+C</code> then <code className="bg-blue-200 px-2 py-1 rounded text-xs">npm run dev</code>
              </p>
            </div>
          </div>
        </div>

        {/* Warning Message */}
        <div className="p-6 bg-yellow-50">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-900 mb-1">Production System</h4>
              <p className="text-sm text-yellow-800">
                This is a production-ready system that requires valid API keys to operate.
                There are no fallbacks or simulation modes. All agents execute tasks using real AI.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 rounded-b-lg flex justify-between items-center">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors font-medium"
          >
            Reload After Setup
          </button>
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            Continue Anyway (Not Recommended)
          </button>
        </div>
      </div>
    </div>
  );
}
