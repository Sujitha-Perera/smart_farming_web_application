// backend/services/PDFService.js
import PDFDocument from 'pdfkit';
import Crop from './model/cropModel.js';
import Reminder from './model/reminderModel.js';

class PDFService {
  /**
   * Initialize PDF document with proper configuration
   */
  static createDocument() {
    return new PDFDocument({ 
      margin: 50,
      size: 'A4',
      font: 'Helvetica',
      info: {
        Title: 'Farming Report',
        Author: 'Farm Management System',
        Creator: 'Farm Management System'
      }
    });
  }

  /**
   * Generate crops PDF
   */
  static async generateCropsPDF(crops, user) {
    return new Promise((resolve, reject) => {
      try {
        const doc = this.createDocument();
        const buffers = [];
        
        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        // Add header and content
        this.addHeader(doc, 'My Crop Details', '#16a34a');
        this.addUserInfo(doc, user);
        this.addCropsTable(doc, crops);
        this.addFooter(doc, `Total Crops: ${crops.length}`);
        
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Generate reminders PDF
   */
  static async generateRemindersPDF(reminders, user) {
    return new Promise((resolve, reject) => {
      try {
        const doc = this.createDocument();
        const buffers = [];
        
        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        this.addHeader(doc, 'My Farming Reminders', '#f59e0b');
        this.addUserInfo(doc, user);
        this.addRemindersTable(doc, reminders);
        
        const completed = reminders.filter(r => r.isDone).length;
        const pending = reminders.filter(r => !r.isDone).length;
        this.addFooter(doc, `Total: ${reminders.length} | Completed: ${completed} | Pending: ${pending}`);
        
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Generate full report PDF
   */
  static async generateFullReportPDF(crops, reminders, user) {
    return new Promise((resolve, reject) => {
      try {
        const doc = this.createDocument();
        const buffers = [];
        
        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        this.addHeader(doc, 'Farming Report', '#3b82f6');
        this.addUserInfo(doc, user);
        
        // Crops section
        this.addSectionHeader(doc, 'Crops Overview');
        if (crops.length > 0) {
          this.addCropsTable(doc, crops);
        } else {
          this.addNoDataMessage(doc, 'No crops available');
        }

        // Add space between sections
        doc.moveDown(1);

        // Reminders section
        this.addSectionHeader(doc, 'Reminders');
        if (reminders.length > 0) {
          this.addRemindersTable(doc, reminders);
        } else {
          this.addNoDataMessage(doc, 'No reminders available');
        }

        this.addFooter(doc, `Summary: ${crops.length} crops | ${reminders.length} reminders`);
        
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Add header to PDF
   */
  static addHeader(doc, title, color) {
    // Title
    doc.fontSize(20)
       .fillColor(color)
       .font('Helvetica-Bold')
       .text(title, { align: 'center' })
       .moveDown(0.3);
    
    // Subtitle line
    doc.fontSize(10)
       .fillColor('#6b7280')
       .font('Helvetica')
       .text('Farm Management System', { align: 'center' })
       .moveDown(0.5);
    
    // Decorative line
    doc.moveTo(50, doc.y)
       .lineTo(545, doc.y)
       .lineWidth(2)
       .strokeColor(color)
       .stroke()
       .moveDown(1);
  }

  /**
   * Add user information
   */
  static addUserInfo(doc, user) {
    const currentDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    doc.fontSize(10)
       .fillColor('#374151')
       .text(`Farmer: ${user?.name || 'N/A'}`, 50, doc.y)
       .text(`Date: ${currentDate}`, { align: 'right' })
       .moveDown(1);
  }

  /**
   * Add crops table with proper column headers
   */
  static addCropsTable(doc, crops) {
    const startY = doc.y;
    
    // Table header background
    doc.rect(50, startY, 500, 25)
       .fillAndStroke('#16a34a', '#16a34a');

    // Column headers - ADDED EXPLICIT FONT AND COLOR SETTINGS
    doc.fontSize(10)
       .fillColor('#ffffff')
       .font('Helvetica-Bold')
       .text('Crop Type', 60, startY + 8)
       .text('Land Area', 160, startY + 8)
       .text('Soil Type', 260, startY + 8)
       .text('Planting Date', 360, startY + 8)
       .text('Harvest Date', 460, startY + 8);

    let currentY = startY + 30;

    // Table rows
    doc.font('Helvetica')
       .fontSize(9)
       .fillColor('#1f2937');

    crops.forEach((crop, index) => {
      // Check if we need a new page
      if (currentY > 700) {
        doc.addPage();
        currentY = 50;
        // Add table header on new page
        this.addCropsTableHeader(doc, currentY);
        currentY += 30;
      }

      // Alternate row background
      if (index % 2 === 0) {
        doc.rect(50, currentY - 5, 500, 20)
           .fillColor('#f8f9fa')
           .fill();
      }

      // Crop data - RESET FONT FOR DATA
      doc.font('Helvetica')
         .fontSize(9)
         .fillColor('#1f2937')
         .text(crop.cropType || 'N/A', 60, currentY)
         .text(crop.landArea || 'N/A', 160, currentY)
         .text(crop.soilType || 'N/A', 260, currentY)
         .text(crop.plantingDate ? new Date(crop.plantingDate).toLocaleDateString() : 'N/A', 360, currentY)
         .text(crop.expectedHarvestDate ? new Date(crop.expectedHarvestDate).toLocaleDateString() : 'N/A', 460, currentY);

      currentY += 20;
    });

    doc.y = currentY + 10;
  }

  /**
   * Add crops table header for new pages
   */
  static addCropsTableHeader(doc, yPosition) {
    // Header background
    doc.rect(50, yPosition, 500, 25)
       .fillAndStroke('#16a34a', '#16a34a');

    // Column headers
    doc.fontSize(10)
       .fillColor('#ffffff')
       .font('Helvetica-Bold')
       .text('Crop Type', 60, yPosition + 8)
       .text('Land Area', 160, yPosition + 8)
       .text('Soil Type', 260, yPosition + 8)
       .text('Planting Date', 360, yPosition + 8)
       .text('Harvest Date', 460, yPosition + 8);
  }

  /**
   * Add reminders table with proper column headers
   */
  static addRemindersTable(doc, reminders) {
    const startY = doc.y;
    
    // Table header background
    doc.rect(50, startY, 500, 25)
       .fillAndStroke('#f59e0b', '#f59e0b');

    // Column headers
    doc.fontSize(10)
       .fillColor('#ffffff')
       .font('Helvetica-Bold')
       .text('Task Description', 60, startY + 8)
       .text('Due Date', 350, startY + 8)
       .text('Status', 450, startY + 8);

    let currentY = startY + 30;

    // Table rows
    doc.font('Helvetica')
       .fontSize(9)
       .fillColor('#1f2937');

    reminders.forEach((reminder, index) => {
      if (currentY > 700) {
        doc.addPage();
        currentY = 50;
        this.addRemindersTableHeader(doc, currentY);
        currentY += 30;
      }

      // Alternate row background
      if (index % 2 === 0) {
        doc.rect(50, currentY - 5, 500, 20)
           .fillColor('#fefce8')
           .fill();
      }

      // Format message - MOVED TO LEFT with proper alignment
      const message = reminder.message && reminder.message.length > 45 ? 
        `${reminder.message.substring(0, 45)}...` : reminder.message || 'N/A';

      // Status
      const status = reminder.isDone ? 'Completed' : 'Pending';
      const statusColor = reminder.isDone ? '#16a34a' : '#dc2626';

      // Reset font for data rows
      doc.font('Helvetica')
         .fontSize(9)
         .fillColor('#1f2937')
         .text(message, 60, currentY, { width: 270 }) // Reduced width to move text left
         .text(reminder.date ? new Date(reminder.date).toLocaleDateString() : 'N/A', 350, currentY)
         .fillColor(statusColor)
         .text(status, 450, currentY);

      currentY += 20;
    });

    doc.y = currentY + 10;
  }

  /**
   * Add reminders table header for new pages
   */
  static addRemindersTableHeader(doc, yPosition) {
    // Header background
    doc.rect(50, yPosition, 500, 25)
       .fillAndStroke('#f59e0b', '#f59e0b');

    // Column headers
    doc.fontSize(10)
       .fillColor('#ffffff')
       .font('Helvetica-Bold')
       .text('Task Description', 60, yPosition + 8)
       .text('Due Date', 350, yPosition + 8)
       .text('Status', 450, yPosition + 8);
  }

  /**
   * Add section header for full report
   */
  static addSectionHeader(doc, title) {
    if (doc.y > 650) {
      doc.addPage();
    }

    doc.fontSize(14)
       .fillColor('#374151')
       .font('Helvetica-Bold')
       .text(title)
       .moveDown(0.2);

    // Section underline
    doc.moveTo(50, doc.y)
       .lineTo(200, doc.y)
       .lineWidth(1)
       .strokeColor('#d1d5db')
       .stroke()
       .moveDown(0.5);
  }

  /**
   * Add no data message
   */
  static addNoDataMessage(doc, message) {
    doc.fontSize(10)
       .fillColor('#9ca3af')
       .font('Helvetica-Italic')
       .text(message)
       .moveDown(0.5);
  }

  /**
   * Add footer to PDF
   */
  static addFooter(doc, text) {
    // Add page margin at bottom
    if (doc.y > 700) {
      doc.addPage();
    }

    const footerY = 750;

    // Footer line
    doc.moveTo(50, footerY)
       .lineTo(545, footerY)
       .lineWidth(1)
       .strokeColor('#e5e7eb')
       .stroke();

    // Footer text
    doc.fontSize(8)
       .fillColor('#6b7280')
       .font('Helvetica')
       .text(text, 50, footerY + 10, { align: 'center', width: 495 })
       .text(`Generated on ${new Date().toLocaleString()}`, 50, footerY + 25, { align: 'center', width: 495 });
  }
}

// Route Handlers
export const downloadCropsPDF = async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log('Generating crops PDF for user:', userId);
    const crops = await Crop.find({ userId }).populate('userId');
    
    if (!crops || crops.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'No crops found for this user' 
      });
    }

    const pdfBuffer = await PDFService.generateCropsPDF(crops, crops[0].userId);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="my_crops_${Date.now()}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    console.log('Crops PDF generated successfully');
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to generate crops PDF',
      details: error.message 
    });
  }
};

export const downloadRemindersPDF = async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log('Generating reminders PDF for user:', userId);
    const reminders = await Reminder.find({ userId }).populate('userId');
    
    if (!reminders || reminders.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'No reminders found for this user' 
      });
    }

    const pdfBuffer = await PDFService.generateRemindersPDF(reminders, reminders[0].userId);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="my_reminders_${Date.now()}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    console.log('Reminders PDF generated successfully');
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to generate reminders PDF',
      details: error.message 
    });
  }
};

export const downloadFullReportPDF = async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log('Generating full report PDF for user:', userId);
    const [crops, reminders] = await Promise.all([
      Crop.find({ userId }).populate('userId'),
      Reminder.find({ userId }).populate('userId')
    ]);

    console.log(`Found ${crops.length} crops and ${reminders.length} reminders`);

    if (crops.length === 0 && reminders.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'No data found for this user' 
      });
    }

    const user = crops[0]?.userId || reminders[0]?.userId;
    const pdfBuffer = await PDFService.generateFullReportPDF(crops, reminders, user);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="farming_report_${Date.now()}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    console.log('Full report PDF generated successfully');
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to generate full report PDF',
      details: error.message 
    });
  }
};

export { PDFService };