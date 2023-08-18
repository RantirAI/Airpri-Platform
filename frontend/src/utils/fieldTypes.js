import { GridCellKind, GridColumnIcon } from '@glideapps/glide-data-grid'

export default [
    {
        icon: GridColumnIcon.HeaderString,
        value: GridCellKind.Text,
        label: 'Text'
    },
    {
        icon: GridColumnIcon.HeaderTextTemplate,
        value: GridCellKind.Text,
        label: 'Long Text'
    },
    {
        icon: GridColumnIcon.HeaderTextTemplate,
        value: GridCellKind.Text,
        label: 'Rich Text'
    },
    {
        icon: GridColumnIcon.HeaderUri,
        value: GridCellKind.Uri,
        label: 'Link/Slug'
    },
    {
        icon: GridColumnIcon.HeaderEmail,
        value: GridCellKind.Text,
        label: 'Email'
    },
    {
        icon: GridColumnIcon.HeaderCode,
        value: GridCellKind.Protected,
        label: 'Password'
    },
    {
        icon: GridColumnIcon.HeaderNumber,
        value: GridCellKind.Number,
        label: 'Number'
    },
    {
        icon: GridColumnIcon.HeaderJoinStrings,
        value: GridCellKind.Bubble,
        label: 'Enumeration'
    },
    {
        icon: GridColumnIcon.HeaderBoolean,
        value: GridCellKind.Boolean,
        label: 'Boolean'
    },
    {
        icon: GridColumnIcon.HeaderImage,
        value: GridCellKind.Custom,
        label: 'Color'
    },
    {
        icon: GridColumnIcon.HeaderDate,
        value: GridCellKind.Custom,
        label: 'Date'
    },
    {
        icon: GridColumnIcon.HeaderTime,
        value: GridCellKind.Custom,
        label: 'Time'
    },
    {
        icon: GridColumnIcon.HeaderCode,
        value: GridCellKind.Custom,
        label: 'JSON'
    },
    {
        icon: GridColumnIcon.HeaderImage,
        value: GridCellKind.Custom,
        label: 'Attachment'
    },
]