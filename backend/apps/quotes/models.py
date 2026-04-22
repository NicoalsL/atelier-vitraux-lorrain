from django.db import models


class QuoteRequest(models.Model):
    TYPE_CHOICES = [
        ('panneau',      'Panneau decoratif'),
        ('vitrail',      'Vitrail architectural'),
        ('luminaire',    'Luminaire'),
        ('restauration', 'Restauration'),
        ('autre',        'Autre'),
    ]
    BUDGET_CHOICES = [
        ('<500',       'Moins de 500 EUR'),
        ('500-1500',   '500 a 1 500 EUR'),
        ('1500-5000',  '1 500 a 5 000 EUR'),
        ('>5000',      'Plus de 5 000 EUR'),
    ]

    first_name        = models.CharField(max_length=80)
    last_name         = models.CharField(max_length=80)
    email             = models.EmailField()
    phone             = models.CharField(max_length=20, blank=True)
    project_type      = models.CharField(max_length=20, choices=TYPE_CHOICES)
    dimensions        = models.CharField(max_length=100, blank=True)
    budget            = models.CharField(max_length=20, choices=BUDGET_CHOICES, blank=True)
    description       = models.TextField()
    timeline          = models.CharField(max_length=200, blank=True)
    reference_images  = models.FileField(upload_to='quotes/', blank=True, null=True)
    created_at        = models.DateTimeField(auto_now_add=True)
    read              = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Devis {self.project_type} — {self.first_name} {self.last_name}"
