import { BudgetData } from './types/budgetData';
import puppeteer from 'puppeteer';

// ✅ Función para generar el template HTML del presupuesto
function generateBudgetHTML(budgetData: BudgetData): string {
  console.log('Generating HTML for budget data:', budgetData);
  const {
    budgetNumber,
    companyName,
    budgetTitle = '',
    date,
    items,
    subtotal,
    tax,
    total,
    clientName = '',
    clientAddress = '',
    clientPhone = '',
    clientEmail = '',
  } = budgetData;

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Presupuesto ${budgetNumber}</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background: #fff;
            }
            
            .container {
                max-width: 210mm;
                margin: 0 auto;
                padding: 20px;
            }
            
            .header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 40px;
                border-bottom: 3px solid #2563eb;
                padding-bottom: 20px;
            }
            
            .company-info {
                flex: 1;
            }
            
            .company-name {
                font-size: 24px;
                font-weight: bold;
                color: #2563eb;
                margin-bottom: 8px;
            }
            
            .company-details {
                color: #666;
                font-size: 14px;
            }
            
            .budget-info {
                text-align: right;
                flex: 1;
            }
            
            .budget-title {
                font-size: 28px;
                font-weight: bold;
                color: #1e40af;
                margin-bottom: 10px;
            }
            
            .budget-number {
                font-size: 16px;
                color: #666;
                margin-bottom: 5px;
            }
            
            .budget-date {
                font-size: 14px;
                color: #666;
            }
            
            .client-section {
                margin: 30px 0;
                padding: 20px;
                background: #f8fafc;
                border-left: 4px solid #2563eb;
            }
            
            .client-title {
                font-size: 16px;
                font-weight: bold;
                color: #1e40af;
                margin-bottom: 10px;
            }
            
            .client-info {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
                font-size: 14px;
            }
            
            .items-section {
                margin: 30px 0;
            }
            
            .section-title {
                font-size: 18px;
                font-weight: bold;
                color: #1e40af;
                margin-bottom: 15px;
                border-bottom: 2px solid #e5e7eb;
                padding-bottom: 5px;
            }
            
            .items-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            
            .items-table th {
                background: #2563eb;
                color: white;
                padding: 12px 8px;
                text-align: left;
                font-weight: 600;
                font-size: 14px;
            }
            
            .items-table td {
                padding: 12px 8px;
                border-bottom: 1px solid #e5e7eb;
                font-size: 14px;
            }
            
            .items-table tr:nth-child(even) {
                background: #f9fafb;
            }
            
            .items-table tr:hover {
                background: #f3f4f6;
            }
            
            .text-right {
                text-align: right;
            }
            
            .text-center {
                text-align: center;
            }
            
            .totals-section {
                margin-top: 30px;
                display: flex;
                justify-content: flex-end;
            }
            
            .totals-table {
                min-width: 300px;
                border-collapse: collapse;
            }
            
            .totals-table td {
                padding: 8px 15px;
                border-bottom: 1px solid #e5e7eb;
            }
            
            .totals-label {
                font-weight: 600;
                color: #374151;
            }
            
            .totals-amount {
                text-align: right;
                font-weight: 600;
            }
            
            .total-final {
                background: #2563eb;
                color: white;
                font-size: 16px;
                font-weight: bold;
            }
            
            .footer {
                margin-top: 50px;
                padding-top: 20px;
                border-top: 2px solid #e5e7eb;
                font-size: 12px;
                color: #666;
                text-align: center;
            }
            
            .footer-note {
                margin-bottom: 10px;
                font-style: italic;
            }
            
            @media print {
                body { margin: 0; }
                .container { padding: 15px; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <!-- Header -->
            <div class="header">
                <div class="company-info">
                    <div class="company-name">${companyName}</div>
                    <div class="company-details">
                        Servicios de Fontanería y Lampistería<br>
                        Tel: +34 XXX XXX XXX<br>
                        Email:${companyName.toLowerCase()}<br>
                    </div>
                </div>
                <div class="budget-info">
                    <div class="budget-title">PRESUPUESTO</div>
                    <div class="budget-number">Nº ${budgetNumber}</div>
                    <div class="budget-date">Fecha: ${new Date(date).toLocaleDateString('es-ES')}</div>
                </div>
            </div>

            <!-- Cliente -->
            <div class="client-section">
                <div class="client-title">DATOS DEL CLIENTE</div>
                <div class="client-info">
                    <div><strong>Nombre:</strong> ${clientName}</div>
                    <div><strong>Teléfono:</strong> ${clientPhone}</div>
                    <div><strong>Dirección:</strong> ${clientAddress}</div>
                    <div><strong>Email:</strong> ${clientEmail}</div>
                </div>
            </div>

            <!-- Título del Presupuesto -->
            ${
              budgetTitle
                ? `
            <div style="margin: 20px 0; padding: 15px; background: #eff6ff; border-radius: 8px;">
                <h3 style="color: #1e40af; margin: 0;">${budgetTitle}</h3>
            </div>
            `
                : ''
            }

            <!-- Items -->
            <div class="items-section">
                <div class="section-title">DETALLE DE SERVICIOS</div>
                <table class="items-table">
                    <thead>
                        <tr>
                            <th style="width: 50%">Descripción</th>
                            <th style="width: 15%" class="text-center">Cantidad</th>
                            <th style="width: 15%" class="text-right">Precio Unit.</th>
                            <th style="width: 20%" class="text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${items
                          .map(
                            (item) => `
                            <tr>
                                <td>${item.description}</td>
                                <td class="text-center">${item.quantity}</td>
                                <td class="text-right">${item.unitPrice.toFixed(2)}€</td>
                                <td class="text-right">${(item.quantity * item.unitPrice).toFixed(2)}€</td>
                            </tr>
                        `,
                          )
                          .join('')}
                    </tbody>
                </table>
            </div>

            <!-- Totales -->
            <div class="totals-section">
                <table class="totals-table">
                    <tr>
                        <td class="totals-label">Subtotal:</td>
                        <td class="totals-amount">${subtotal.toFixed(2)}€</td>
                    </tr>
                    <tr>
                        <td class="totals-label">IVA (21%):</td>
                        <td class="totals-amount">${tax.toFixed(2)}€</td>
                    </tr>
                    <tr class="total-final">
                        <td class="totals-label">TOTAL:</td>
                        <td class="totals-amount">${total.toFixed(2)}€</td>
                    </tr>
                </table>
            </div>

            <!-- Footer -->
            <div class="footer">
                <div class="footer-note">
                    Este presupuesto tiene una validez de 30 días desde la fecha de emisión.
                </div>
                <div>
                    Generado automáticamente por Sistema de Gestión - ${new Date().toLocaleDateString('es-ES')}
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
}

// ✅ Función genérica para generar PDFs
export async function generatePDF(budgetData: BudgetData): Promise<Buffer> {
  console.log('Generating PDF with budget data:', budgetData);
  let browser;

  try {
    // ✅ Configuración optimizada para servidores
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage', // Para servidores con poca memoria
      ],
    });

    const page = await browser.newPage();

    // ✅ Mejor manejo del contenido HTML
    const htmlContent = generateBudgetHTML(budgetData);
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0',
    });

    // ✅ Configuración del PDF mejorada
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true, // Para que se vean colores de fondo
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px',
      },
    });

    return pdfBuffer;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  } finally {
    // ✅ IMPORTANTE: Siempre cerrar el browser
    if (browser) {
      await browser.close();
    }
  }
}

// ✅ Función específica para presupuestos
export async function generateBudgetPDF(
  budgetData: BudgetData,
): Promise<Buffer> {
  return await generatePDF(budgetData);
}
