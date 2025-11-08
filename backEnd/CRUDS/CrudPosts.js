const { supabase } = require('../config/supabase');

async function criarPost(dados) {
  try {
    // Validação authorUsername
    if (typeof dados.authorUsername !== 'string') {
      throw new Error('authorUsername precisa ser uma string simples');
    }

    const postData = {
      site_name: dados.siteName,
      description: dados.description,
      category: dados.category,
      author_username: dados.authorUsername,
      likes: 0,
      dislikes: 0,
      liked_users: [],
      disliked_users: []
    };

    const { data, error } = await supabase
      .from('posts')
      .insert([postData])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { dados: data, mensagem: 'Post criado com sucesso!' };
  } catch (err) {
    console.error('Erro ao criar post:', err.message);
    return { dados: err, mensagem: 'Erro ao criar post.' };
  }
}

async function atualizarPost(id, dados, usuarioAtual) {
  try {
    if (typeof usuarioAtual !== 'string') {
      throw new Error('authorUsername precisa ser uma string simples');
    }

    // Busca o post primeiro para verificar autorização
    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;
    if (!post) throw new Error('Post não encontrado');
    if (post.author_username !== usuarioAtual) throw new Error('Não autorizado');

    // Atualiza apenas siteName, description, category
    const { data, error } = await supabase
      .from('posts')
      .update({
        site_name: dados.siteName,
        description: dados.description,
        category: dados.category
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return { dados: data, mensagem: 'Post atualizado com sucesso!' };
  } catch (err) {
    console.error('Erro ao atualizar post:', err.message);
    return { dados: err, mensagem: 'Erro ao atualizar post.' };
  }
}

async function excluirPost(id, usuarioAtual) {
  try {
    if (typeof usuarioAtual !== 'string') {
      throw new Error('authorUsername precisa ser uma string simples');
    }

    // Busca o post primeiro para verificar autorização
    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;
    if (!post) throw new Error('Post não encontrado');
    if (post.author_username !== usuarioAtual) throw new Error('Não autorizado');

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return { dados: null, mensagem: 'Post excluído com sucesso!' };
  } catch (err) {
    console.error('Erro ao excluir post:', err.message);
    return { dados: err, mensagem: 'Erro ao excluir post.' };
  }
}

async function votarPost(id, usuarioAtual, tipo) {
  try {
    if (typeof usuarioAtual !== 'string') {
      throw new Error('authorUsername precisa ser uma string simples');
    }

    // Busca o post
    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;
    if (!post) throw new Error('Post não encontrado');

    let likedUsers = post.liked_users || [];
    let dislikedUsers = post.disliked_users || [];
    let likes = post.likes || 0;
    let dislikes = post.dislikes || 0;

    const jaDeuLike = likedUsers.includes(usuarioAtual);
    const jaDeuDislike = dislikedUsers.includes(usuarioAtual);

    if (tipo === 'like') {
      if (jaDeuLike) {
        // Remove like
        likedUsers = likedUsers.filter(u => u !== usuarioAtual);
        likes--;
      } else {
        // Adiciona like
        likedUsers.push(usuarioAtual);
        likes++;
        // Remove dislike se existir
        if (jaDeuDislike) {
          dislikedUsers = dislikedUsers.filter(u => u !== usuarioAtual);
          dislikes--;
        }
      }
    } else if (tipo === 'dislike') {
      if (jaDeuDislike) {
        // Remove dislike
        dislikedUsers = dislikedUsers.filter(u => u !== usuarioAtual);
        dislikes--;
      } else {
        // Adiciona dislike
        dislikedUsers.push(usuarioAtual);
        dislikes++;
        // Remove like se existir
        if (jaDeuLike) {
          likedUsers = likedUsers.filter(u => u !== usuarioAtual);
          likes--;
        }
      }
    } else {
      throw new Error('Tipo inválido');
    }

    // Atualiza o post
    const { data, error } = await supabase
      .from('posts')
      .update({
        liked_users: likedUsers,
        disliked_users: dislikedUsers,
        likes: likes,
        dislikes: dislikes
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return { dados: data, mensagem: 'Voto registrado com sucesso!' };
  } catch (err) {
    console.error('Erro ao votar post:', err.message);
    return { dados: err, mensagem: 'Erro ao votar post.' };
  }
}

async function listarPosts(filtroSite = '') {
  try {
    let query = supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    // Aplica filtro se fornecido
    if (filtroSite) {
      query = query.ilike('site_name', `%${filtroSite}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { dados: data, mensagem: 'Posts listados com sucesso!' };
  } catch (err) {
    console.error('Erro ao listar posts:', err.message);
    return { dados: err, mensagem: 'Erro ao listar posts.' };
  }
}

module.exports = {
  criarPost,
  listarPosts,
  atualizarPost,
  excluirPost,
  votarPost
};
