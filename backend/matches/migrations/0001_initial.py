from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Competition',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('external_id', models.IntegerField(unique=True)),
                ('name', models.CharField(max_length=100)),
                ('code', models.CharField(max_length=10)),
            ],
        ),
        migrations.CreateModel(
            name='Team',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('external_id', models.IntegerField(unique=True)),
                ('name', models.CharField(max_length=100)),
                ('short_name', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Match',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('external_id', models.IntegerField(unique=True)),
                ('utc_date', models.DateTimeField()),
                ('status', models.CharField(max_length=20)),
                ('home_score', models.IntegerField(blank=True, null=True)),
                ('away_score', models.IntegerField(blank=True, null=True)),
                ('away_team', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='away_matches', to='matches.team')),
                ('competition', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='matches.competition')),
                ('home_team', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='home_matches', to='matches.team')),
            ],
        ),
    ]