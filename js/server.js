const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const pdf = require('pdf-parse');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('.'));

// Endpoint para listar archivos en la carpeta data
app.get('/api/files', (req, res) => {
  const dataPath = path.join(__dirname, 'data');
  
  try {
    if (!fs.existsSync(dataPath)) {
      fs.mkdirSync(dataPath, { recursive: true });
      return res.json({ success: true, files: [] });
    }
    
    const files = fs.readdirSync(dataPath)
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.pdf', '.txt', '.json', '.md'].includes(ext);
      })
      .map(file => {
        const filePath = path.join(dataPath, file);
        const stats = fs.statSync(filePath);
        const ext = path.extname(file).toLowerCase();
        
        return {
          name: file,
          path: `/data/${file}`,
          size: stats.size,
          type: ext.replace('.', ''),
          lastModified: stats.mtime.toISOString()
        };
      });
    
    res.json({ success: true, files: files });
  } catch (error) {
    console.error('Error reading data folder:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint para extraer texto de PDFs
app.post('/api/process-pdf', async (req, res) => {
  try {
    const { filename } = req.body;
    const pdfPath = path.join(__dirname, 'data', filename);
    
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ success: false, error: 'File not found' });
    }
    
    const dataBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdf(dataBuffer);
    
    res.json({
      success: true,
      filename: filename,
      content: pdfData.text,
      numPages: pdfData.numpages,
      info: pdfData.info
    });
  } catch (error) {
    console.error('Error processing PDF:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint para leer archivos de texto
app.get('/api/read-text/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'data', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: 'File not found' });
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');
    
    res.json({
      success: true,
      filename: filename,
      content: content
    });
  } catch (error) {
    console.error('Error reading text file:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint para cargar TODOS los documentos automáticamente
app.get('/api/load-all-documents', async (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'data');
    
    if (!fs.existsSync(dataPath)) {
      return res.json({ success: true, documents: [] });
    }
    
    const files = fs.readdirSync(dataPath)
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.pdf', '.txt', '.json', '.md'].includes(ext);
      });
    
    const documents = [];
    
    for (const file of files) {
      const filePath = path.join(dataPath, file);
      const ext = path.extname(file).toLowerCase();
      let content = '';
      
      if (ext === '.pdf') {
        try {
          const dataBuffer = fs.readFileSync(filePath);
          const pdfData = await pdf(dataBuffer);
          content = pdfData.text;
        } catch (pdfError) {
          console.error(`Error processing PDF ${file}:`, pdfError);
          content = `[Contenido del PDF ${file} - error en extracción]`;
        }
      } else {
        // Para archivos de texto
        content = fs.readFileSync(filePath, 'utf-8');
      }
      
      documents.push({
        filename: file,
        content: content.substring(0, 100000), // Limitar tamaño
        type: ext.replace('.', ''),
        uploadDate: new Date().toISOString(),
        size: fs.statSync(filePath).size
      });
    }
    
    res.json({ success: true, documents: documents });
  } catch (error) {
    console.error('Error loading all documents:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
  console.log(`📁 Monitoreando carpeta: ${path.join(__dirname, 'data')}`);
});