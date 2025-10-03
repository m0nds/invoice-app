import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


export const generateInvoicePDF = async (invoiceElement, invoiceData) => {
  try {

    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '210mm'; // A4 width
    tempContainer.style.backgroundColor = 'white';
    tempContainer.style.padding = '20mm';
    tempContainer.style.fontFamily = 'Arial, sans-serif';
    

    const clonedElement = invoiceElement.cloneNode(true);
    

    const interactiveElements = clonedElement.querySelectorAll('button, .dropdown, .close-button, [onclick]');
    interactiveElements.forEach(el => el.remove());
    

    clonedElement.style.backgroundColor = 'white';
    clonedElement.style.border = 'none';
    clonedElement.style.boxShadow = 'none';
    clonedElement.style.maxWidth = 'none';
    clonedElement.style.maxHeight = 'none';
    clonedElement.style.overflow = 'visible';
    clonedElement.style.position = 'static';
    

    const allElements = clonedElement.querySelectorAll('*');
    allElements.forEach(el => {
      if (el.style.color && el.style.color !== 'rgb(0, 0, 0)') {
        el.style.color = '#000000';
      }
    });
    
    tempContainer.appendChild(clonedElement);
    document.body.appendChild(tempContainer);
    

    await new Promise(resolve => setTimeout(resolve, 100));
    

    const canvas = await html2canvas(tempContainer, {
      scale: 1.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: tempContainer.scrollWidth,
      height: tempContainer.scrollHeight,
      logging: false
    });
    

    const imgData = canvas.toDataURL('image/png', 0.95);
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210; 
    const pageHeight = 295; 
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    
    let position = 0;
    
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    
    document.body.removeChild(tempContainer);
    
    // Download PDF
    const fileName = `Invoice_${invoiceData.id}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
    
    return { success: true, fileName };
  } catch (error) {
    console.error('PDF generation error:', error);
    return { success: false, error: error.message };
  }
};

// Duplicate Invoice Utility
export const duplicateInvoice = (originalInvoice) => {
  const duplicatedInvoice = {
    ...originalInvoice,
    id: generateInvoiceId(),
    status: 'DRAFT',
    statusColor: 'gray',
    createdAt: new Date().toISOString(),
    // Add "(Copy)" to customer name to distinguish
    customerName: `${originalInvoice.customerName} (Copy)`,
    // Update dates to current date
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
  };
  
  return duplicatedInvoice;
};

// Generate Shareable Link
export const generateShareableLink = (invoiceId) => {
  const baseUrl = window.location.origin;
  const shareableUrl = `${baseUrl}/invoice/${invoiceId}`;
  
  // Copy to clipboard
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(shareableUrl);
    return { success: true, url: shareableUrl };
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = shareableUrl;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return { success: true, url: shareableUrl };
    } catch (err) {
      document.body.removeChild(textArea);
      return { success: false, error: 'Failed to copy link' };
    }
  }
};

// Generate unique invoice ID
const generateInvoiceId = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substr(2, 4);
  return `${timestamp}-${random.toUpperCase()}`;
};

// Format currency
export const formatCurrency = (amount) => {
  if (typeof amount === 'string') {
    return amount;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// Calculate days until due date
export const getDaysUntilDue = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Get status color class
export const getStatusColorClass = (status) => {
  const statusColors = {
    'PAID': 'bg-green-100 text-green-800 border-green-200',
    'OVERDUE': 'bg-red-100 text-red-800 border-red-200',
    'DRAFT': 'bg-gray-100 text-gray-800 border-gray-200',
    'PENDING PAYMENT': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'SENT': 'bg-blue-100 text-blue-800 border-blue-200',
    'PARTIAL PAYMENT': 'bg-purple-100 text-purple-800 border-purple-200'
  };
  return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};
