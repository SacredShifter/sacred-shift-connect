/**
 * Ethos Verification: Data Minimization & Privacy Tests
 * Ensures Sovereignty & Privacy principle compliance
 */

import { describe, it, expect } from 'vitest';

// Define PII fields that require explicit purpose & retention
const PII_FIELDS = [
  'email', 'phone', 'dob', 'name', 'first_name', 'last_name',
  'address', 'street_address', 'city', 'postal_code', 'zip_code',
  'lat', 'lng', 'latitude', 'longitude', 'location',
  'ip_address', 'device_id', 'user_agent', 'fingerprint',
  'social_security', 'passport', 'license', 'payment_method',
  'bank_account', 'credit_card', 'biometric', 'health_data'
];

// Sacred Shifter data schema validation
interface SchemaField {
  key: string;
  type: string;
  required?: boolean;
  purpose?: string;
  retention_days?: number;
  lawful_basis?: 'consent' | 'contract' | 'legal_obligation' | 'vital_interests' | 'public_task' | 'legitimate_interests';
  minimization_justified?: boolean;
}

interface DataSchema {
  table_name: string;
  fields: SchemaField[];
  data_category: 'ceremony' | 'telemetry' | 'user_profile' | 'field_data' | 'system';
}

// Mock schemas - in real implementation, these would be imported from actual schema files
const MOCK_SCHEMAS: DataSchema[] = [
  {
    table_name: 'user_profiles',
    data_category: 'user_profile',
    fields: [
      {
        key: 'id',
        type: 'uuid',
        required: true
      },
      {
        key: 'email',
        type: 'string',
        required: false,
        purpose: 'Authentication and ceremony invitations',
        retention_days: 2555, // 7 years for legal compliance
        lawful_basis: 'consent',
        minimization_justified: true
      },
      {
        key: 'display_name',
        type: 'string',
        required: false,
        purpose: 'Community identification in ceremonies',
        retention_days: 365,
        lawful_basis: 'consent',
        minimization_justified: true
      },
      {
        key: 'created_at',
        type: 'timestamp',
        required: true
      }
    ]
  },
  {
    table_name: 'ceremony_sessions',
    data_category: 'ceremony',
    fields: [
      {
        key: 'id',
        type: 'uuid',
        required: true
      },
      {
        key: 'user_id',
        type: 'uuid',
        required: true
      },
      {
        key: 'session_type',
        type: 'string',
        required: true
      },
      {
        key: 'duration_seconds',
        type: 'integer',
        required: true,
        purpose: 'Measure coherence progress and optimize ceremony timing',
        retention_days: 365,
        lawful_basis: 'legitimate_interests',
        minimization_justified: true
      }
    ]
  },
  {
    table_name: 'field_integrity_metrics',
    data_category: 'field_data',
    fields: [
      {
        key: 'id',
        type: 'uuid',
        required: true
      },
      {
        key: 'coherence_level',
        type: 'float',
        required: true,
        purpose: 'Monitor collective field integrity and prevent manipulation',
        retention_days: 90,
        lawful_basis: 'legitimate_interests',
        minimization_justified: true
      }
    ]
  }
];

describe('Ethos: Sovereignty & Privacy Verification', () => {
  describe('Data Minimization Compliance', () => {
    it('PII fields must declare explicit purpose', () => {
      MOCK_SCHEMAS.forEach(schema => {
        schema.fields.forEach(field => {
          const isPII = PII_FIELDS.some(piiField => 
            field.key.toLowerCase().includes(piiField.toLowerCase())
          );
          
          if (isPII) {
            expect(
              field.purpose,
              `PII field ${schema.table_name}.${field.key} must declare explicit purpose`
            ).toBeTruthy();
            
            expect(
              field.purpose!.length,
              `Purpose for ${schema.table_name}.${field.key} must be descriptive (>20 chars)`
            ).toBeGreaterThan(20);
          }
        });
      });
    });

    it('PII fields must specify retention period', () => {
      MOCK_SCHEMAS.forEach(schema => {
        schema.fields.forEach(field => {
          const isPII = PII_FIELDS.some(piiField => 
            field.key.toLowerCase().includes(piiField.toLowerCase())
          );
          
          if (isPII) {
            expect(
              typeof field.retention_days,
              `PII field ${schema.table_name}.${field.key} must specify retention_days`
            ).toBe('number');
            
            expect(
              field.retention_days!,
              `Retention period for ${schema.table_name}.${field.key} must be positive`
            ).toBeGreaterThan(0);
            
            // Sacred Shifter principle: reasonable retention periods
            expect(
              field.retention_days!,
              `Retention period for ${schema.table_name}.${field.key} should not exceed 7 years without strong justification`
            ).toBeLessThanOrEqual(2555); // 7 years
          }
        });
      });
    });

    it('PII fields must specify lawful basis', () => {
      const validLawfulBases = ['consent', 'contract', 'legal_obligation', 'vital_interests', 'public_task', 'legitimate_interests'];
      
      MOCK_SCHEMAS.forEach(schema => {
        schema.fields.forEach(field => {
          const isPII = PII_FIELDS.some(piiField => 
            field.key.toLowerCase().includes(piiField.toLowerCase())
          );
          
          if (isPII) {
            expect(
              field.lawful_basis,
              `PII field ${schema.table_name}.${field.key} must specify lawful_basis`
            ).toBeTruthy();
            
            expect(
              validLawfulBases.includes(field.lawful_basis!),
              `Lawful basis for ${schema.table_name}.${field.key} must be valid GDPR basis`
            ).toBe(true);
          }
        });
      });
    });

    it('Data collection must be justified as minimal', () => {
      MOCK_SCHEMAS.forEach(schema => {
        schema.fields.forEach(field => {
          const isPII = PII_FIELDS.some(piiField => 
            field.key.toLowerCase().includes(piiField.toLowerCase())
          );
          
          if (isPII) {
            expect(
              field.minimization_justified,
              `PII field ${schema.table_name}.${field.key} must justify data minimization`
            ).toBe(true);
          }
        });
      });
    });
  });

  describe('Sacred Data Categories', () => {
    it('Ceremony data has appropriate retention', () => {
      const ceremonySchemas = MOCK_SCHEMAS.filter(s => s.data_category === 'ceremony');
      
      ceremonySchemas.forEach(schema => {
        schema.fields.forEach(field => {
          if (field.retention_days) {
            // Ceremony data should not be kept indefinitely
            expect(
              field.retention_days,
              `Ceremony field ${schema.table_name}.${field.key} should have reasonable retention`
            ).toBeLessThanOrEqual(1095); // 3 years max
          }
        });
      });
    });

    it('Telemetry data is consent-based', () => {
      const telemetrySchemas = MOCK_SCHEMAS.filter(s => s.data_category === 'telemetry');
      
      telemetrySchemas.forEach(schema => {
        schema.fields.forEach(field => {
          const isPII = PII_FIELDS.some(piiField => 
            field.key.toLowerCase().includes(piiField.toLowerCase())
          );
          
          if (isPII) {
            expect(
              field.lawful_basis,
              `Telemetry PII ${schema.table_name}.${field.key} must be consent-based`
            ).toBe('consent');
          }
        });
      });
    });

    it('Field data has minimal retention', () => {
      const fieldSchemas = MOCK_SCHEMAS.filter(s => s.data_category === 'field_data');
      
      fieldSchemas.forEach(schema => {
        schema.fields.forEach(field => {
          if (field.retention_days) {
            // Field integrity data should be short-term
            expect(
              field.retention_days,
              `Field data ${schema.table_name}.${field.key} should have short retention for privacy`
            ).toBeLessThanOrEqual(365); // 1 year max
          }
        });
      });
    });
  });

  describe('Consent & Transparency', () => {
    it('User profile data allows user control', () => {
      const userProfileSchema = MOCK_SCHEMAS.find(s => s.table_name === 'user_profiles');
      expect(userProfileSchema).toBeDefined();
      
      // Should include fields that enable user sovereignty
      const hasOptionalFields = userProfileSchema!.fields.some(f => !f.required);
      expect(hasOptionalFields, 'User profiles should include optional fields for user control').toBe(true);
    });

    it('No sensitive biometric or health data without strong justification', () => {
      const sensitivePII = ['biometric', 'health_data', 'social_security', 'passport'];
      
      MOCK_SCHEMAS.forEach(schema => {
        schema.fields.forEach(field => {
          const isSensitive = sensitivePII.some(sensitive => 
            field.key.toLowerCase().includes(sensitive.toLowerCase())
          );
          
          if (isSensitive) {
            // If we collect sensitive data, it must have very strong justification
            expect(
              field.purpose && field.purpose.length > 50,
              `Sensitive field ${schema.table_name}.${field.key} needs detailed purpose justification`
            ).toBe(true);
            
            expect(
              field.lawful_basis === 'consent' || field.lawful_basis === 'vital_interests',
              `Sensitive field ${schema.table_name}.${field.key} requires consent or vital interests basis`
            ).toBe(true);
          }
        });
      });
    });
  });

  describe('Dark Pattern Prevention', () => {
    it('No default consent assumptions', () => {
      // This would be tested against actual consent UI components
      // For now, we ensure data schemas don't assume consent
      
      MOCK_SCHEMAS.forEach(schema => {
        schema.fields.forEach(field => {
          if (field.lawful_basis === 'consent') {
            // Consent fields should not be required (no forced consent)
            expect(
              field.required,
              `Consent-based field ${schema.table_name}.${field.key} should not be required (no forced consent)`
            ).not.toBe(true);
          }
        });
      });
    });

    it('Data purposes are specific, not broad', () => {
      const broadPurposes = [
        'business purposes', 'marketing', 'analytics', 'improvement',
        'research', 'general use', 'administrative'
      ];
      
      MOCK_SCHEMAS.forEach(schema => {
        schema.fields.forEach(field => {
          if (field.purpose) {
            const isBroad = broadPurposes.some(broad => 
              field.purpose!.toLowerCase().includes(broad.toLowerCase())
            );
            
            if (isBroad) {
              console.warn(
                `Field ${schema.table_name}.${field.key} has broad purpose: "${field.purpose}". Consider being more specific.`
              );
            }
          }
        });
      });
    });
  });

});

// Export for use in CI scripts
export { PII_FIELDS, MOCK_SCHEMAS };
export type { DataSchema, SchemaField };