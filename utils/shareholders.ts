// constants/shareholders.ts
export const REQUIRED_COLUMNS = [
    'date','slno', 'dpid', 'clid', 'holder', 'add1', 'add2', 'add3', 'add4', 
    'pincode', 'shares', 'pcnt', 'type', 'pan_no', 'phone', 
    'mailid', 'category', 'subgroup'
  ] as const;
  
  export const OPTIONAL_COLUMNS = [
  ] as const;
  
  export type RequiredColumn = typeof REQUIRED_COLUMNS[number];
  export type OptionalColumn = typeof OPTIONAL_COLUMNS[number];
  export type ColumnName = RequiredColumn | OptionalColumn;
  
  export const validateShareholderData = (data: any[]): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!Array.isArray(data) || data.length === 0) {
      return { valid: false, errors: ['No data provided'] };
    }
  
    // Check required columns
    REQUIRED_COLUMNS.forEach(column => {
      if (!data[0].hasOwnProperty(column)) {
        errors.push(`Missing required column: ${column}`);
      }
    });
  
    return { 
      valid: errors.length === 0,
      errors
    };
  };