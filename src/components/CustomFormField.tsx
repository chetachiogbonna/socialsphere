"use client";

import { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Textarea } from './ui/textarea'
import { Input } from './ui/input'
import CustomTagInput from './CustomTagInput';
import { Post } from '@/types';
import HandleImage from './HandleImage';

type CustomFormFieldProps = {
  control: Control<{
    title: string;
    location: string;
    tags: string[];
  }>,
  label: { name: "Title" }
  | { name: "Image" }
  | { name: "Location" }
  | {
    name: "Tags",
    watch: UseFormWatch<{
      title: string;
      location: string;
      tags: string[];
    }>,
    setValue: UseFormSetValue<{
      title: string;
      location: string;
      tags: string[];
    }>
  },
  post?: Post
}

function CustomFormField({ control, label, post }: CustomFormFieldProps) {
  switch (label.name) {
    case "Title":
      return (
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label.name}</FormLabel>
              <FormControl>
                <Textarea
                  className="flex items-center gap-2 bg-[#1A1A1A] border-light focus-visible:ring-0 focus-visible:outline-none text-white rounded-md h-24"
                  placeholder="Write your content here..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    case "Location":
      return (
        <FormField
          control={control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label.name}</FormLabel>
              <FormControl>
                <Input
                  className="bg-[#1A1A1A] border-light focus-visible:ring-0 focus-visible:outline-none text-white"
                  placeholder="Location"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    case "Tags":
      return (
        <FormField
          control={control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label.name}</FormLabel>
              <FormControl>
                <CustomTagInput
                  field={field}
                  value={label.watch("tags")}
                  fieldChange={(tags) => label.setValue("tags", tags, { shouldValidate: true })}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    case "Image":
      return <HandleImage post={post} />
  }
}

export default CustomFormField