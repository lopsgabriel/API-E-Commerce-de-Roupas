# Generated by Django 5.1.3 on 2024-11-20 20:14

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('perfil', '0001_initial'),
        ('roupas', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='perfil',
            name='carrinho',
        ),
        migrations.CreateModel(
            name='Item_carrinho',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantidade', models.PositiveIntegerField(default=1)),
                ('perfil_carrinho', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='perfil.perfil')),
                ('produto', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='roupas.produto')),
            ],
        ),
    ]
