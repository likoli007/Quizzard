'use client';

import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

import { cn } from '@/lib/utils';

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuContent = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
	<DropdownMenuPrimitive.Portal>
		<DropdownMenuPrimitive.Content
			ref={ref}
			className={cn(
				'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 text-sm shadow-md',
				className
			)}
			{...props}
		/>
	</DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

export const DropdownMenuItem = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
>(({ className, ...props }, ref) => (
	<DropdownMenuPrimitive.Item
		ref={ref}
		className={cn(
			'flex cursor-pointer items-center rounded-sm px-2 py-1.5 transition-colors outline-none select-none hover:bg-gray-100',
			className
		)}
		{...props}
	/>
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
