import { cva } from 'class-variance-authority'

const buttonVariants = cva(
  'flex items-center justify-center gap-2 whitespace-nowrap rounded-[7px] text-base font-semibold uppercase ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-custom-gradient-2 text-[#F7F7F7] hover:bg-custom-gradient-2/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background text-[#1B88F6] hover:bg-accent',
        blue: 'bg-transparent border-[1px] border-[#00A2CA] text-[#C2C6D1] hover:bg-transparent/80',
        dark: 'bg-[#141927] border-[1px] border-[#141927] text-[#F7F7F7] hover:bg-[#141927]/80',
        secondary:
          'bg-transparent border-[1px] border-[#22293B] text-[#C2C6D1] hover:bg-transparent/80',
        ghost: 'text-[#C2C6D1] hover:bg-custom-gradient-2 hover:text-[#F7F7F7]',
        pagination: 'text-[#9B9A9D] hover:bg-accent/10',
        paginationActive: 'text-[#C2C6D1] hover:bg-accent/10',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        xs: 'h-10 px-4 py-2.5 text-sm',
        default: 'h-12 px-6 py-3',
        sm: 'h-8 px-4 py-2 text-xs',
        lg: 'h-14 px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export { buttonVariants }
