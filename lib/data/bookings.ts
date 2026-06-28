export const bookingData = (    
    limit: number = 10, 
    page: number = 10, 
    search?: string,
) => (Array.from({ length: limit }, (_, index) => {
    
    const skip = (page - 1) * limit;
    const total = 35;
    return {
        id: index + skip <= total - limit ? skip : total - limit,
        name: "John Doe",
        email: 'john.doe@example.com',
        tour: '3-Day Maasai Mara Treat'
    }
}));