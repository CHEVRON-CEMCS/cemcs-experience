import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '../../components/Navbar'
// import PaymentStatus from '@/components/PaymentStatus'

const ThankYouPage = () => {
  const order = {
    id: 'sample-order-id',
    _isPaid: true,
    user: {
      email: 'user@example.com',
    },
    products: [
      {
        id: 'product-1',
        name: 'Sample Product',
        price: 99.99,
        category: 'category-1',
        images: [{ image: { url: '/empty-cart.jpg' } }],
        product_files: { url: '/path/to/download.zip' },
      },
    ],
  }

  const orderTotal = order.products.reduce((total, product) => {
    return total + product.price
  }, 0)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NGN',
    }).format(price)
  }

  return (
    <div>
        <Navbar />
        <main className='relative lg:min-h-full'>
        <div className='hidden lg:block h-80 overflow-hidden lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12'>
            <Image
            fill
            src='/checkout-thank-you.jpg'
            className='h-full w-full object-cover object-center'
            alt='thank you for your order'
            />
        </div>

        <div>
            <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24'>
            <div className='lg:col-start-2'>
                <p className='text-sm font-medium text-blue-600'>
                Order successful
                </p>
                <h1 className='mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl'>
                Thanks for ordering
                </h1>
                {order._isPaid ? (
                <p className='mt-2 text-base text-muted-foreground'>
                    Your order was processed and your products are available for pickup. We've sent your receipt and order details to{' '}
                    <span className='font-medium text-gray-900'>
                    {order.user.email}
                    </span>.
                </p>
                ) : (
                <p className='mt-2 text-base text-muted-foreground'>
                    We appreciate your order, and we&apos;re currently processing it. So hang tight and we&apos;ll send you confirmation very soon!
                </p>
                )}

                <div className='mt-16 text-sm font-medium'>
                <div className='text-muted-foreground'>Order nr.</div>
                <div className='mt-2 text-gray-900'>{order.id}</div>

                <ul className='mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-muted-foreground'>
                    {order.products.map((product) => {
                    const downloadUrl = product.product_files.url
                    const { image } = product.images[0]

                    return (
                        <li key={product.id} className='flex space-x-6 py-6'>
                        <div className='relative h-24 w-24'>
                            <Image
                            fill
                            src='/empty-cart.png'
                            alt={`${product.name} image`}
                            className='flex-none rounded-md bg-gray-100 object-cover object-center'
                            />
                        </div>

                        <div className='flex-auto flex flex-col justify-between'>
                            <div className='space-y-1'>
                            <h3 className='text-gray-900'>{product.name}</h3>
                            </div>

                            {order._isPaid ? (
                            <a
                                href={downloadUrl}
                                download={product.name}
                                className='text-blue-600 hover:underline underline-offset-2'>
                                Download receipt
                            </a>
                            ) : null}
                        </div>

                        <p className='flex-none font-medium text-gray-900'>
                            {formatPrice(product.price)}
                        </p>
                        </li>
                    )
                    })}
                </ul>

                <div className='space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-muted-foreground'>
                    <div className='flex justify-between'>
                    <p>Subtotal</p>
                    <p className='text-gray-900'>{formatPrice(orderTotal)}</p>
                    </div>

                    <div className='flex justify-between'>
                    <p>Transaction Fee</p>
                    <p className='text-gray-900'>{formatPrice(1)}</p>
                    </div>

                    <div className='flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900'>
                    <p className='text-base'>Total</p>
                    <p className='text-base'>{formatPrice(orderTotal + 1)}</p>
                    </div>
                </div>

                {/* <PaymentStatus
                    isPaid={order._isPaid}
                    orderEmail={order.user.email}
                    orderId={order.id}
                /> */}

                <div className='mt-16 border-t border-gray-200 py-6 text-right'>
                    <Link
                    href='/products'
                    className='text-sm font-medium text-blue-600 hover:text-blue-500'>
                    Continue shopping &rarr;
                    </Link>
                </div>
                </div>
            </div>
            </div>
        </div>
        </main>

    </div>
  )
}

export default ThankYouPage
