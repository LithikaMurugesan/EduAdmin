import { format } from 'date-fns';

export const exportToCSV = (data: Record<string, unknown>[], filename: string, headers: { key: string; label: string }[]) => {
  const headerRow = headers.map(h => h.label).join(',');
  const rows = data.map(item => 
    headers.map(h => {
      const value = item[h.key];
      if (value instanceof Date) {
        return format(value, 'yyyy-MM-dd');
      }
      
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value ?? '';
    }).join(',')
  );

  const csvContent = [headerRow, ...rows].join('\n');
  downloadFile(csvContent, `${filename}.csv`, 'text/csv');
};

export const exportToExcel = (data: Record<string, unknown>[], filename: string, headers: { key: string; label: string }[]) => {

  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?><?mso-application progid="Excel.Sheet"?>';
  const workbookStart = '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="Sheet1"><Table>';
  const workbookEnd = '</Table></Worksheet></Workbook>';

  const headerRow = `<Row>${headers.map(h => `<Cell><Data ss:Type="String">${escapeXml(h.label)}</Data></Cell>`).join('')}</Row>`;
  
  const dataRows = data.map(item => 
    `<Row>${headers.map(h => {
      const value = item[h.key];
      const type = typeof value === 'number' ? 'Number' : 'String';
      const displayValue = value instanceof Date ? format(value, 'yyyy-MM-dd') : String(value ?? '');
      return `<Cell><Data ss:Type="${type}">${escapeXml(displayValue)}</Data></Cell>`;
    }).join('')}</Row>`
  ).join('');

  const xmlContent = xmlHeader + workbookStart + headerRow + dataRows + workbookEnd;
  downloadFile(xmlContent, `${filename}.xls`, 'application/vnd.ms-excel');
};

const escapeXml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
