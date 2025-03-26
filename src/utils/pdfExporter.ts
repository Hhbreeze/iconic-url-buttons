
import { toast } from "sonner";
import { ColumnCount } from "./noteFormatters";

export function exportNotesToPdf(formattedNotes: string, columnCount: ColumnCount) {
  try {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Pop-up blocked. Please allow pop-ups for this site.");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Notes PDF</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              margin: 40px;
              white-space: pre-wrap;
            }
            h1 {
              color: #333;
              margin-bottom: 20px;
            }
            .notes-content {
              border: 1px solid #ddd;
              padding: 20px;
              background-color: #f9f9f9;
              border-radius: 5px;
              ${columnCount !== "1" ? `
              column-count: ${columnCount};
              column-gap: 40px;
              column-rule: 1px solid #ddd;
              ` : ''}
            }
            
            /* Direct highlighting styles - critical for PDF rendering */
            mark {
              display: inline-block !important;
              border-radius: 2px !important;
              padding: 0 2px !important;
            }
            mark.yellow {
              background-color: #fff9c4 !important;
              color: #000 !important;
            }
            mark.pink {
              background-color: #f8bbd0 !important;
              color: #000 !important;
            }
            mark.green {
              background-color: #c8e6c9 !important;
              color: #000 !important;
            }
            mark.blue {
              background-color: #bbdefb !important;
              color: #000 !important;
            }
            mark.purple {
              background-color: #e1bee7 !important;
              color: #000 !important;
            }
            strong {
              font-weight: bold !important;
            }
            em {
              font-style: italic !important;
            }
            u {
              text-decoration: underline !important;
            }
            
            /* Print-specific styles */
            @media print {
              body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              mark {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              .notes-content {
                ${columnCount !== "1" ? `
                column-count: ${columnCount} !important;
                column-gap: 40px !important;
                column-rule: 1px solid #ddd !important;
                ` : ''}
              }
            }
          </style>
        </head>
        <body>
          <h1>My Notes</h1>
          <div class="notes-content" id="notes-content"></div>
          <script>
            window.onload = function() {
              // Set the content first
              document.getElementById('notes-content').innerHTML = \`${formattedNotes.replace(/`/g, "\\`")}\`;
              
              // Process all mark elements to ensure highlighting works
              const marks = document.querySelectorAll('mark');
              marks.forEach(mark => {
                const colorClass = mark.className;
                if (colorClass) {
                  // Apply styles directly to ensure they stick
                  switch(colorClass) {
                    case 'yellow':
                      mark.style.cssText = "background-color: #fff9c4 !important; color: #000 !important; display: inline-block !important; border-radius: 2px !important; padding: 0 2px !important;";
                      break;
                    case 'pink':
                      mark.style.cssText = "background-color: #f8bbd0 !important; color: #000 !important; display: inline-block !important; border-radius: 2px !important; padding: 0 2px !important;";
                      break;
                    case 'green':
                      mark.style.cssText = "background-color: #c8e6c9 !important; color: #000 !important; display: inline-block !important; border-radius: 2px !important; padding: 0 2px !important;";
                      break;
                    case 'blue':
                      mark.style.cssText = "background-color: #bbdefb !important; color: #000 !important; display: inline-block !important; border-radius: 2px !important; padding: 0 2px !important;";
                      break;
                    case 'purple':
                      mark.style.cssText = "background-color: #e1bee7 !important; color: #000 !important; display: inline-block !important; border-radius: 2px !important; padding: 0 2px !important;";
                      break;
                  }
                }
              });
              
              // Wait for styles to be applied before printing
              setTimeout(function() {
                window.focus();
                window.print();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    toast.success("Notes ready for PDF export. Select 'Save as PDF' in the print dialog.");
  } catch (error) {
    console.error("Failed to generate PDF:", error);
    toast.error("Failed to generate PDF. Please try again.");
  }
}
