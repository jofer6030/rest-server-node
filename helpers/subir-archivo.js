const path = require("path");
const { v4: uuidv4 } = require("uuid");

const subirArchivo = (
  files,
  extensionesValidas = ["png", "jpg", "gif", "jpeg"],
  carpeta = ""
) => {
  return new Promise((resolve, reject) => {
    const { archivo } = files;

    // Validar tipo de archivo
    const tipo = archivo.name.split(".");
    const extension = tipo[tipo.length - 1];

    if (!extensionesValidas.includes(extension)) {
      return reject(
        `El archivo debe ser de uno de los tipos: ${extensionesValidas}`
      );
    }

    const nombreTem = `${uuidv4()}.${extension}`;
    const uploadPath = path.join(__dirname, "../uploads/", carpeta, nombreTem);

    archivo.mv(uploadPath, (err) => {
      if (err) {
        reject(err);
      }

      resolve(nombreTem);
    });
  });
};

module.exports = { subirArchivo };
