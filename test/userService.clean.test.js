const { UserService } = require ('../src/userService');

const dadosUsuarioPadrao = {
  nome: 'Fulano de Tal',
  email: 'fulano@teste.com',
  idade: 25,
};

describe('UserService - Suíte de Testes Limpos', () => {
  let userService;

  beforeAll(() => {
    userService = new UserService();
    userService._clearDB();
  });

  test('deve criar um usuário com id definido e status ativo', () => {
    // Arrange
    const { nome, email, idade } = dadosUsuarioPadrao;
    // Act
    const usuarioCriado = userService.createUser(nome, email, idade);
    // Assert
    expect(usuarioCriado.id).toBeDefined();
    expect(usuarioCriado.status).toBe('ativo');
    expect(usuarioCriado.nome).toBe(nome);
  });

  test('deve buscar um usuário pelo id e retornar os dados corretos', () => {
    // Arrange
    const usuarioCriado = userService.createUser(dadosUsuarioPadrao.nome, dadosUsuarioPadrao.email, dadosUsuarioPadrao.idade);
    // Act
    const usuarioBuscado = userService.getUserById(usuarioCriado.id);
    // Assert
    expect(usuarioBuscado).toBeDefined();
    expect(usuarioBuscado.nome).toBe(dadosUsuarioPadrao.nome);
    expect(usuarioBuscado.status).toBe('ativo');
  });

  test('deve desativar usuário comum', () => {
    // Arrange
    const usuarioComum = userService.createUser('Comum', 'comum@teste.com', 30);
    // Act
    const resultado = userService.deactivateUser(usuarioComum.id);
    const usuarioAtualizado = userService.getUserById(usuarioComum.id);
    // Assert
    expect(resultado).toBe(true);
    expect(usuarioAtualizado.status).toBe('inativo');
  });

  test('não deve desativar usuário administrador', () => {
    // Arrange
    const usuarioAdmin = userService.createUser('Admin', 'admin@teste.com', 40, true);
    // Act
    const resultado = userService.deactivateUser(usuarioAdmin.id);
    const usuarioAtualizado = userService.getUserById(usuarioAdmin.id);
    // Assert
    expect(resultado).toBe(false);
    expect(usuarioAtualizado.status).toBe('ativo');
  });

  test('deve gerar relatório incluindo todos os usuários ativos', () => {
    // Arrange
    const usuario1 = userService.createUser('Alice', 'alice@email.com', 28);
    const usuario2 = userService.createUser('Bob', 'bob@email.com', 32);
    // Act
    const relatorio = userService.generateUserReport();
    // Assert
    expect(typeof relatorio).toBe('string');
    expect(relatorio).toMatch(/Relat[óo]rio de Usu[áa]rios/);
    expect(relatorio).toContain(usuario1.nome);
    expect(relatorio).toContain(usuario2.nome);
    expect(relatorio).toContain(usuario1.id);
    expect(relatorio).toContain(usuario2.id);
  });

  test('deve lançar erro ao tentar criar usuário menor de idade', () => {
    // Arrange && Act && Assert
    expect(() => {
      userService.createUser('Menor', 'menor@email.com', 17);
    }).toThrow('O usuário deve ser maior de idade.');
  });
});
