from django.apps import AppConfig

class PerfilConfig(AppConfig):
    """
    Configuração do aplicativo Perfil. O Django utiliza este arquivo para configurar o comportamento do app.
    Aqui você define configurações específicas, como o campo de ID padrão e o nome do app, além de inicializar sinais (signals).
    """

    default_auto_field = 'django.db.models.BigAutoField'
    """
    Define o tipo de campo utilizado para o auto incremento dos IDs das tabelas.
    'BigAutoField' é o tipo de campo de chave primária que é uma grande quantidade numérica (BigInt) automaticamente gerada.
    """
    
    name = 'perfil'
    """
    Nome do aplicativo, que é usado pelo Django para identificar este app no projeto.
    O nome é 'perfil', que corresponde ao diretório do app dentro do projeto.
    """

    def ready(self):
        """
        Este método é chamado quando o app é carregado. Ele é utilizado para importar sinais (signals).
        Sinais são usados para realizar ações automáticas em resposta a eventos específicos.
        Aqui, estamos importando os sinais definidos no arquivo 'perfil.signals'.
        """
        import perfil.signals
