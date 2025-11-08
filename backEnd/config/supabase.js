// Supabase Client Configuration
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // Use service key for backend operations

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERRO: SUPABASE_URL ou SUPABASE_SERVICE_KEY não está configurada');
  console.error('Por favor, configure as variáveis no arquivo .env');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Test connection
async function testConnection() {
  try {
    const { data, error } = await supabase.from('users').select('count').single();
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned (table might be empty)
      throw error;
    }
    console.log('✅ Conexão com Supabase estabelecida com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com Supabase:', error.message);
    return false;
  }
}

module.exports = { supabase, testConnection };
