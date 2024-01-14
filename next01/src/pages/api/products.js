// pages/api/products.js
import multer from 'multer';
import path from 'path';

const productos = [];

const storage = multer.diskStorage({
  destination: 'public/uploads/',
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    const nombreArchivo = Date.now() + extension;
    cb(null, nombreArchivo);
  },
});

const upload = multer({ storage });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Obtener lista de productos
    res.status(200).json(productos);
  } else if (req.method === 'POST') {
    // Agregar nuevo producto
    upload.single('imagen')(req, res, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ mensaje: 'Error al subir la imagen' });
      }

      const { nombre, precio, descripcion } = req.body;
      const imagen = req.file ? `/uploads/${req.file.filename}` : null;

      const nuevoProducto = { id: Date.now().toString(), nombre, precio, descripcion, imagen };
      productos.push(nuevoProducto);
      res.status(201).json({ mensaje: 'Producto agregado con éxito', producto: nuevoProducto });
    });
  } else {
    res.status(405).json({ mensaje: 'Método no permitido' });
  }
}