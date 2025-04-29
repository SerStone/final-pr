import { CircularProgress, Typography, Box } from '@mui/material';

const LoaderOrError = ({ isLoading, error,children }: { isLoading: boolean; error: any,children: React.ReactNode; }) => {
    if (isLoading) {
        return (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="200px">
                <Typography variant="body1" mb={2}>Loading…</Typography>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
                <Typography color="error" variant="body1">
                    {typeof error === 'string' ? error : error?.data?.detail || error?.detail || 'Unexpected error'}
                </Typography>
            </Box>
        );
    }

    return <>{children}</>;
};


export { LoaderOrError}