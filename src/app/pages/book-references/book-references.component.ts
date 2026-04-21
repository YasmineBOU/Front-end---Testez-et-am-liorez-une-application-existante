import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-book-references',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './book-references.component.html',
    styleUrls: ['./book-references.component.css']
})
export class BookReferencesComponent {
    private router = inject(Router);

    readonly references = [
        {
            title: 'Clean Code',
            author: 'Robert C. Martin',
            topic: 'Software craftsmanship'
        },
        {
            title: 'Domain-Driven Design',
            author: 'Eric Evans',
            topic: 'Architecture and modeling'
        },
        {
            title: 'Refactoring',
            author: 'Martin Fowler',
            topic: 'Code improvement'
        }
    ];

    onBackHome(): void {
        this.router.navigateByUrl('');
    }
}
