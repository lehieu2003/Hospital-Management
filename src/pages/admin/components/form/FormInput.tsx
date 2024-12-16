import { FormControl, FormHelperText, Input, InputLabel, InputProps, OutlinedInput } from '@mui/material'
import React, { useId } from 'react'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'

interface TextInputProps<T extends FieldValues> extends InputProps {
    control: Control<T>
    // only allow key of T
    name: Path<T> 
    label: string,
    variant?: "outlined" | "standard" | "filled"
    controlProps?: React.ComponentProps<typeof FormControl>
}

const VariantMap = {
    outlined: OutlinedInput,
    standard: Input,
    filled: Input
}


export default function FormInput<T extends FieldValues>({ control, name, label, variant = 'standard', controlProps, ...rest }: TextInputProps<T>) {
    const id = useId()
    const Component = VariantMap[variant]
    return (
        <Controller
            name={name}
            control={control}
            render={({ field:{value,...restField}, formState }) => (
                <FormControl fullWidth error={!!formState.errors[name]}
                    accessKey={id}
                    variant={variant}
                    {...controlProps}
                >
                    <InputLabel
                        shrink={value ? true : false}
                        htmlFor={id}>{label}</InputLabel>
                    <Component
                        notched={value ? true : false}
                        value={value}
                        id={id} label={label}  {...rest} {...restField as InputProps}
                        aria-describedby={`${id}-helper-text`}
                    />
                    <FormHelperText
                        id={`${id}-helper-text`}
                    >
                        {formState.errors[name]?.message?.toString()}
                    </FormHelperText>
                </FormControl>

            )}
        />
    )
}
