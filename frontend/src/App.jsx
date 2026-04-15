import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3001';

const estadoInicial = {
  nome: '',
  email: '',
  idade: '',
  curso: '',
  matricula: '',
  telefone: ''
};

function App() {
  const [alunos, setAlunos] = useState([]);
  const [form, setForm] = useState(estadoInicial);
  const [editandoId, setEditandoId] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarAlunos();
  }, []);

  async function carregarAlunos() {
    try {
      setErro('');
      const resposta = await fetch(`${API_URL}/alunos`);
      const dados = await resposta.json();
      setAlunos(dados);
    } catch (error) {
      console.error(error);
      setErro('Não foi possível carregar os alunos.');
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm({
      ...form,
      [name]: value
    });
  }

  function limparFormulario() {
    setForm(estadoInicial);
    setEditandoId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMensagem('');
    setErro('');

    const metodo = editandoId ? 'PUT' : 'POST';
    const url = editandoId
      ? `${API_URL}/alunos/${editandoId}`
      : `${API_URL}/alunos`;

    try {
      const resposta = await fetch(url, {
        method: metodo,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...form,
          idade: Number(form.idade)
        })
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.erro || 'Erro ao salvar aluno.');
        return;
      }

      setMensagem(editandoId ? 'Aluno atualizado com sucesso.' : 'Aluno cadastrado com sucesso.');
      limparFormulario();
      carregarAlunos();
    } catch (error) {
      console.error(error);
      setErro('Erro de conexão com a API.');
    }
  }

  function editarAluno(aluno) {
    setMensagem('');
    setErro('');
    setEditandoId(aluno.id);
    setForm({
      nome: aluno.nome,
      email: aluno.email,
      idade: String(aluno.idade),
      curso: aluno.curso,
      matricula: aluno.matricula,
      telefone: aluno.telefone
    });
  }

  async function excluirAluno(id) {
    const confirmou = window.confirm('Deseja realmente excluir este aluno?');
    if (!confirmou) return;

    setMensagem('');
    setErro('');

    try {
      const resposta = await fetch(`${API_URL}/alunos/${id}`, {
        method: 'DELETE'
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.erro || 'Erro ao excluir aluno.');
        return;
      }

      setMensagem('Aluno excluído com sucesso.');
      if (editandoId === id) {
        limparFormulario();
      }
      carregarAlunos();
    } catch (error) {
      console.error(error);
      setErro('Erro de conexão com a API.');
    }
  }

  return (
    <div className="container">
      <h1>CRUD de Alunos</h1>

      <form className="formulario" onSubmit={handleSubmit}>
        
        <div className="campo">
          <label>Nome</label>
          <input name="nome" value={form.nome} onChange={handleChange} required />
        </div>

        <div className="campo">
          <label>E-mail</label>
          <input name="email" value={form.email} onChange={handleChange} required />
        </div>

        <div className="campo">
          <label>Idade</label>
          <input type="number" name="idade" value={form.idade} onChange={handleChange} required />
        </div>

        <div className="campo">
          <label>Curso</label>
          <input name="curso" value={form.curso} onChange={handleChange} required />
        </div>

        <div className="campo">
          <label>Matrícula</label>
          <input name="matricula" value={form.matricula} onChange={handleChange} required />
        </div>

        <div className="campo">
          <label>Telefone</label>
          <input name="telefone" value={form.telefone} onChange={handleChange} required />
        </div>

        <div className="botoes-formulario">
          <button type="submit">
            {editandoId ? 'Atualizar' : 'Cadastrar'}
          </button>

          <button
            type="button"
            className="botao-secundario"
            onClick={limparFormulario}
          >
            Limpar
          </button>
        </div>
      </form>

      {mensagem && <p className="mensagem sucesso">{mensagem}</p>}
      {erro && <p className="mensagem erro">{erro}</p>}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Idade</th>
            <th>Curso</th>
            <th>Matrícula</th>
            <th>Telefone</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {alunos.length === 0 ? (
            <tr>
              <td colSpan="8" className="sem-registros">
                Nenhum aluno cadastrado.
              </td>
            </tr>
          ) : (
            alunos.map((aluno) => (
              <tr key={aluno.id}>
                <td>{aluno.id}</td>
                <td>{aluno.nome}</td>
                <td>{aluno.email}</td>
                <td>{aluno.idade}</td>
                <td>{aluno.curso}</td>
                <td>{aluno.matricula}</td>
                <td>{aluno.telefone}</td>
                <td className="acoes">
                  <button className="editar" onClick={() => editarAluno(aluno)}>
                    Editar
                  </button>
                  <button className="excluir" onClick={() => excluirAluno(aluno.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;