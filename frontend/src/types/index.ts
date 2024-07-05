type Rating = {
    rate: number
}

export type Item = {
    id: number,
    title: string,
    description: string,
    image: string,
    discount: number,
    price: number,
    rating: Rating,
    category: string
}