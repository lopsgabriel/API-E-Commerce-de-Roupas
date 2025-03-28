from django.db import models

class Categoria(models.Model):
    """
    Representa uma categoria de roupas.
    Pode ser usada para organizar os produtos em diferentes tipos (ex: Camisetas, Calças, etc.).
    """
    nome = models.CharField(max_length=100)
    """
    Nome da categoria (ex: Camisetas, Calças, etc.).
    """
    
    descricao = models.TextField()
    """
    Descrição detalhada da categoria.
    """

    def __str__(self):
        """
        Retorna o nome da categoria como string para representações simples.
        """
        return self.nome

class Produto(models.Model):
    """
    Representa um produto de roupa.
    Cada produto pertence a uma categoria e contém informações como nome, descrição, preço, estoque e imagem.
    """
    nome = models.CharField(max_length=100, blank=False, null=False)
    """
    Nome do produto (ex: Camiseta Azul, Calça Jeans).
    Não pode ser vazio ou nulo.
    """
    
    descricao = models.TextField(max_length=1000, blank=True, null=True)
    """
    Descrição detalhada do produto. Pode ser nula ou em branco.
    """
    
    preco = models.DecimalField(max_digits=10, decimal_places=2, blank=False, null=False)
    """
    Preço do produto. Deve ter até 10 dígitos no total, com 2 casas decimais.
    Não pode ser vazio ou nulo.
    """
    
    estoque = models.PositiveIntegerField(blank=False, null=False)
    """
    Quantidade disponível em estoque. Não pode ser vazia ou nula.
    """
    
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, blank=False, null=False)
    """
    Categoria à qual o produto pertence.
    A exclusão de uma categoria causará a exclusão de todos os produtos associados a ela (CASCADE).
    Não pode ser vazio ou nulo.
    """
    
    imagem = models.ImageField(upload_to='produtos/', blank=True, null=True)
    """
    Imagem do produto. A imagem será armazenada na pasta 'produtos/'.
    Pode ser nula ou em branco.
    """

    def __str__(self):
        """
        Retorna o nome do produto como string para representações simples.
        """
        return self.nome
