import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '../../components/Navbar'
import { useRouter } from 'next/router'
import Footer from '../../components/Footer'
import { PDFDownloadLink } from '@react-pdf/renderer'
import Receipt from '../../components/Receipt'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

interface OrderItem {
 id: string
 product_name: string
 price: number
 quantity: number
}

interface OrderData {
 id: string
 customer_email: string
 payment_status: string
 items: OrderItem[]
 subtotal: number
 shipping_fee: number
 total_amount: number
 payment_method: string
}

const COLORS = ['#60A5FA', '#34D399', '#F87171', '#FBBF24', '#A78BFA', '#F472B6'];


const ThankYouPage = () => {
  const router = useRouter();
  const { orderData } = router.query;
  const order = orderData ? JSON.parse(orderData as string) : null;
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  if (!order) return <div>Order not found</div>;

  const formatPrice = (price: number) => `₦${price.toLocaleString()}`;

  const generateConfetti = () => {
    const confetti = [];
    for (let i = 0; i < 150; i++) {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      confetti.push(
        <div
          key={i}
          className="absolute w-2 h-2 rounded-sm animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-10px`,
            backgroundColor: color,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        />
      );
    }
    return confetti;
  };
 
  return (
    <div>
      <Navbar />
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0">
            {generateConfetti()}
          </div>
        </div>
      )}
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
 
              {order.payment_method === 'Bank Transfer' ? (
                <p className='mt-2 text-base text-muted-foreground'>
                  Please complete your bank transfer using the details provided. We've sent the payment instructions to{' '}
                  <span className='font-medium text-gray-900'>{order.customer_email}</span>
                </p>
              ) : (
                <p className='mt-2 text-base text-muted-foreground'>
                  Your order was processed and payment is being confirmed.
                  <span className='font-medium text-gray-900'>{order.customer_email}</span>
                </p>
              )}
 
              <div className='mt-16 text-sm font-medium'>
                <div className='text-muted-foreground'>Order nr.</div>
                <div className='mt-2 text-gray-900'>{order.id}</div>
 
                <div className='mt-4'>
                  <PDFDownloadLink 
                    document={<Receipt order={order} />} 
                    fileName={`CEMCS-receipt.pdf`}
                  >
                    {/* {({ loading }) => ( */}
                      <Button variant="outline" >
                        Download Receipt
                      </Button>
                    {/* )} */}
                  </PDFDownloadLink>
                </div>
 
                <ul className='mt-6 divide-y divide-gray-200 border-t border-gray-200'>
                  {order.items.map((item: OrderItem) => (
                    <li key={item.id} className='flex space-x-6 py-6'>
                      <div className='relative h-24 w-24'>
                        <Image
                          fill
                          src='/shop-cap.jpg'
                          alt={item.product_name}
                          className='rounded-md object-cover'
                        />
                      </div>
 
                      <div className='flex-auto flex flex-col justify-between'>
                        <div className='space-y-1'>
                          <h3 className='text-gray-900'>{item.product_name}</h3>
                          <p className='text-muted-foreground'>Quantity: {item.quantity}</p>
                        </div>
                      </div>
 
                      <p className='flex-none font-medium text-gray-900'>
                        {formatPrice(item.price)}
                      </p>
                    </li>
                  ))}
                </ul>
 
                <div className='space-y-6 border-t border-gray-200 pt-6'>
                  <div className='flex justify-between text-muted-foreground'>
                    <p>Subtotal</p>
                    <p className='text-gray-900'>{formatPrice(order.subtotal)}</p>
                  </div>
 
                  <div className='flex justify-between text-muted-foreground'>
                    <p>Transaction Fee</p>
                    <p className='text-gray-900'>{formatPrice(order.shipping_fee)}</p>
                  </div>
 
                  <div className='flex items-center justify-between border-t border-gray-200 pt-6'>
                    <p className='text-base font-medium text-gray-900'>Total</p>
                    <p className='text-base font-medium text-gray-900'>{formatPrice(order.total_amount)}</p>
                  </div>
                </div>
 
                {order.payment_method === 'Bank Transfer' && (
                  <div className='mt-8 rounded-lg bg-gray-50 px-4 py-6'>
                    <h4 className='text-base font-medium text-gray-900 mb-4'>Bank Transfer Details</h4>
                    <div className='space-y-2'>
                      <p>Bank: First Bank</p>
                      <p>Account Name: CEMCS Limited</p>
                      <p>Account Number: 0123456789</p>
                      <p className='text-sm text-muted-foreground mt-2'>Please use your Order ID ({order.id}) as payment reference</p>
                    </div>
                  </div>
                )}
 
                <div className='mt-16 border-t border-gray-200 py-6 text-right'>
                  <Link
                    href='/shop'
                    className='text-sm font-medium text-blue-600 hover:text-blue-500'
                  >
                    Continue shopping &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <style jsx global>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0);
            opacity: 1;
          }
          50% {
            transform: translateY(50vh) rotate(360deg);
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        .animate-confetti {
          animation: confetti linear forwards;
        }
      `}</style>
    </div>
 );
};

export default ThankYouPage;