import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Calendar } from 'lucide-react';

describe('UI Components', () => {
  describe('Button', () => {
    it('should render children', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('should show loading state', () => {
      render(<Button isLoading>Loading</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should apply variant classes', () => {
      const { rerender } = render(<Button variant="primary">Primary</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn-primary');

      rerender(<Button variant="secondary">Secondary</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn-secondary');
    });
  });

  describe('Badge', () => {
    it('should render with default variant', () => {
      render(<Badge>Default</Badge>);
      expect(screen.getByText('Default')).toBeInTheDocument();
    });

    it('should apply variant styles', () => {
      render(<Badge variant="success">Success</Badge>);
      expect(screen.getByText('Success')).toHaveClass('bg-emerald-100');
    });
  });

  describe('EmptyState', () => {
    it('should render title and description', () => {
      render(
        <EmptyState
          icon={Calendar}
          title="No items"
          description="Add your first item"
        />
      );
      expect(screen.getByText('No items')).toBeInTheDocument();
      expect(screen.getByText('Add your first item')).toBeInTheDocument();
    });

    it('should render action if provided', () => {
      render(
        <EmptyState
          icon={Calendar}
          title="No items"
          action={<button>Add item</button>}
        />
      );
      expect(screen.getByText('Add item')).toBeInTheDocument();
    });
  });
});
