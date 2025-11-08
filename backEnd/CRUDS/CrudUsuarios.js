const { supabase } = require('../config/supabase');
const fs = require('fs');
const path = require('path');

function getBase64FromFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        return reject(err);
      }
      const base64String = data.toString('base64');
      const mimeType = getMimeType(filePath);
      const base64WithHeader = `data:${mimeType};base64,${base64String}`;
      resolve(base64WithHeader);
    });
  });
}

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    case '.txt':
      return 'text/plain';
    case '.pdf':
      return 'application/pdf';
    default:
      return 'application/octet-stream';
  }
}

async function criarUsuario(dados) {
  try {
    const base64DefaultImage = await getBase64FromFile('./fotoPerfil.png');

    const userData = {
      username: dados.username,
      password: dados.password,
      role: 'User',
      header_image: base64DefaultImage.split(',')[0],
      bytes_image: base64DefaultImage.split(',')[1] // Store only the base64 part
    };

    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      dados: data,
      mensagem: 'Usuário criado com sucesso!'
    };
  } catch (err) {
    console.log('Erro ao criar usuário: ' + err.message);
    return {
      dados: err,
      mensagem: err.code === '23505' ? 'Usuário já existe.' : 'Erro ao criar usuário.'
    };
  }
}

async function coletarUsuarioPeloNome(nomeDeUsuario) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', nomeDeUsuario)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return {
        dados: null,
        mensagem: 'Usuário não encontrado.'
      };
    }

    console.log('Usuário coletado com sucesso!');

    return {
      dados: data,
      mensagem: 'Usuário coletado com sucesso!'
    };
  } catch (err) {
    console.error('Erro ao coletar usuário:', err.message);
    return {
      dados: err,
      mensagem: 'Erro ao coletar usuário.'
    };
  }
}

async function excluirUsuario(username) {
  try {
    const { data, error } = await supabase
      .from('users')
      .delete()
      .eq('username', username)
      .select();

    if (error) {
      throw error;
    }

    console.log('Usuário removido com sucesso.');

    return {
      dados: data,
      mensagem: 'Usuário removido com sucesso.'
    };
  } catch (err) {
    console.log('Erro ao remover usuário: ' + err.message);
    return {
      dados: err,
      mensagem: 'Erro ao remover usuário.'
    };
  }
}

async function uploadPerfilImage(dados) {
  try {
    const bytes_image = dados.base64String.split(',')[1];
    const header_image = dados.base64String.split(',')[0];

    const { data, error } = await supabase
      .from('users')
      .update({
        bytes_image: bytes_image,
        header_image: header_image
      })
      .eq('username', dados.username)
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Usuário não encontrado');
    }

    return {
      dados: data,
      mensagem: 'Sucesso em editar usuário.'
    };
  } catch (err) {
    console.error('Erro ao editar usuário: ', err.message);
    return {
      dados: err,
      mensagem: 'Erro ao editar usuário.'
    };
  }
}

async function coletarUsuarios() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return {
      dados: data,
      mensagem: 'Sucesso em coletar usuarios.'
    };
  } catch (err) {
    console.error('Erro ao coletar usuarios:', err.message);
    return {
      dados: err,
      mensagem: 'Erro ao coletar usuarios.'
    };
  }
}

module.exports = {
  criarUsuario,
  coletarUsuarioPeloNome,
  excluirUsuario,
  uploadPerfilImage,
  coletarUsuarios
};
