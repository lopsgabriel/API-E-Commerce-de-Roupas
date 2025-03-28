from django.apps import AppConfig

class RoupasConfig(AppConfig):
    """
    Configuração do aplicativo Roupas. O Django utiliza este arquivo para configurar o comportamento do app.
    Aqui você define configurações específicas, como o campo de ID padrão e o nome do app.
    """
    
    default_auto_field = 'django.db.models.BigAutoField'
    """
    Define o tipo de campo usado para o auto incremento dos IDs das tabelas.
    'BigAutoField' é o tipo de campo de chave primária que é uma grande quantidade numérica (BigInt) automaticamente gerada.
    """
    
    name = 'roupas'
    """
    Nome do aplicativo, que é usado pelo Django para identificar este app no projeto.
    O nome é 'roupas', que corresponde ao diretório do app dentro do projeto.
    """
