from django.db import models

class Categoria(models.Model):
    nome = models.CharField(max_length=100)
    descricao = models.TextField()

    def __str__(self):
        return self.nome

class Produto(models.Model):
    nome = models.CharField(max_length=100, blank=False, null=False)
    descricao = models.TextField(max_length=1000, blank=True, null=True)
    preco = models.DecimalField(max_digits=10, decimal_places=2, blank=False, null=False)
    estoque = models.PositiveIntegerField(blank=False, null=False)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, blank=False, null=False)
    imagem = models.ImageField(upload_to='produtos/', blank=True, null=True)

    # def save(self, *args, **kwargs):
    #     self.categoria = self.categoria.nome
    #     super().save(*args, **kwargs)


    def __str__(self):
        return self.nome
     
