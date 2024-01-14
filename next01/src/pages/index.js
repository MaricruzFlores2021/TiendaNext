import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', precio: '', descripcion: '' });
  const [imagenProducto, setImagenProducto] = useState(null);
  const [nextId, setNextId] = useState(1); // Nuevo estado para el próximo ID

  useEffect(() => {
    obtenerListaProductos();
  }, []);

  const obtenerListaProductos = async () => {
    const response = await fetch('/api/products');
    const data = await response.json();
    setProductos(data);
  };

  const agregarProducto = async () => {
    const formData = new FormData();
    formData.append('nombre', nuevoProducto.nombre);
    formData.append('precio', nuevoProducto.precio);
    formData.append('descripcion', nuevoProducto.descripcion);
    formData.append('imagen', imagenProducto);
    formData.append('id', nextId); // Usar el próximo ID en lugar del ID del producto existente

    const response = await fetch('/api/products', {
      method: 'POST',
      body: formData,
    });

    if (response.status === 201) {
      obtenerListaProductos();
      setNuevoProducto({ nombre: '', precio: '', descripcion: '' });
      setImagenProducto(null);
      setNextId(nextId + 1); // Incrementar el ID para el próximo producto
    } else {
      console.error('Error al agregar el producto');
    }
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setImagenProducto(file);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*', maxFiles: 1 });

  return (
    <div style={{ backgroundImage: 'url("https://www.esan.edu.pe/images/blog/2020/05/14/1500x844-imagen2.jpg")', backgroundSize: 'cover', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '2rem', color: '#ffffff' }}>Catálogo de productos</h1> <br></br>
      <div style={{ display: 'flex', overflowX: 'auto' }}>
        {productos.map((producto, index) => ( // Utilizar index como ID en el mapeo
          <div key={index + 1} style={{ margin: '10px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', flex: '0 0 auto' }}>
            {producto.imagen && (
              <img
                src={producto.imagen}
                alt={producto.nombre}
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}
              />
            )}
            <div style={{ padding: '15px', backgroundColor: '#ffffff', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ margin: '0', fontWeight: 'bold', fontSize: '1.5rem' }}>Código C{index + 1}: {producto.nombre}</h3>
              <p style={{ margin: '0', color: 'black', fontSize: '1rem' }}>
                Precio: ${producto.precio} | Descripción: {producto.descripcion}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <h2 style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1rem', marginTop: '20px', color: '#ffffff' }}>Agregar Nuevo Producto</h2><br></br>
      <input
        type="text"
        placeholder=" Ingresar Nombre            "
        value={nuevoProducto.nombre}
        onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
        style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '8px' }}
      />
      <input
        type="text"
        placeholder=" Ingresar Precio               "
        value={nuevoProducto.precio}
        onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })}
        style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '8px' }}
      />
      <input
        type="text"
        placeholder=" Ingresar Descripción       "
        value={nuevoProducto.descripcion}
        onChange={(e) => setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })}
        style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '8px' }}
      />
      <div {...getRootProps()} style={dropzoneStyles}>
        <input {...getInputProps()} />
        <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1rem', marginTop: '20px', color: 'black', backgroundColor: 'white' }}>Arrastra o selecciona la imagen del producto aquí</p>
      </div>
      {imagenProducto && (
        <img src={URL.createObjectURL(imagenProducto)} alt="Producto" className="max-w-full mt-4" style={{ maxHeight: '200px' }} />
      )}
      <button onClick={agregarProducto} className="bg-green-500 text-white px-4 py-2 rounded-md mt-12 mx-auto block hover:bg-green-700 focus:outline-none font-bold"> Agregar Producto </button>
    </div>
  );
}

const dropzoneStyles = {
  border: '2px dashed #cccccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
  marginTop: '10px',
};
