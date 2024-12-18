import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { Button } from '@/components/ui/button'

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

const Receipt = ({ order }: { order: OrderData }) => {
 const styles = StyleSheet.create({
   page: {
     padding: 30,
     fontFamily: 'Helvetica'
   },
   header: {
     fontSize: 18,
     marginBottom: 20,
     textAlign: 'center'
   },
   subHeader: {
     fontSize: 14,
     marginBottom: 10,
     textAlign: 'center',
     color: '#666'
   },
   section: {
     margin: 10,
     padding: 10
   },
   row: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     padding: 5
   },
   label: {
     fontSize: 12
   },
   value: {
     fontSize: 12,
     fontWeight: 'bold'
   },
   divider: {
     borderBottomWidth: 1,
     borderBottomColor: '#000',
     marginVertical: 10
   },
   footer: {
     position: 'absolute',
     bottom: 30,
     left: 0,
     right: 0,
     textAlign: 'center',
     color: '#666',
     fontSize: 10
   }
 });

 return (
   <Document>
     <Page size="A4" style={styles.page}>
       <Text style={styles.header}>CEMCS Limited</Text>
       <Text style={styles.subHeader}>Purchase Receipt</Text>
       
       <View style={styles.section}>
         <Text style={styles.label}>Order Number: {order.id}</Text>
         <Text style={styles.label}>Date: {new Date().toLocaleDateString()}</Text>
         <Text style={styles.label}>Customer Email: {order.customer_email}</Text>
         <Text style={styles.label}>Payment Method: {order.payment_method}</Text>
       </View>

       <View style={styles.divider} />

       <View style={styles.section}>
         <Text style={{ ...styles.label, marginBottom: 10, fontWeight: 'bold' }}>Order Details:</Text>
         {order.items.map((item, index) => (
           <View key={index} style={styles.row}>
             <View style={{ flexDirection: 'row', flex: 1 }}>
               <Text style={styles.label}>{item.product_name}</Text>
               <Text style={styles.label}> x {item.quantity}</Text>
             </View>
             <Text style={styles.value}>₦{item.price.toLocaleString()}</Text>
           </View>
         ))}
       </View>

       <View style={styles.divider} />

       <View style={styles.section}>
         <View style={styles.row}>
           <Text style={styles.label}>Subtotal</Text>
           <Text style={styles.value}>₦{order.subtotal.toLocaleString()}</Text>
         </View>
         <View style={styles.row}>
           <Text style={styles.label}>Transaction Fee</Text>
           <Text style={styles.value}>₦{order.shipping_fee.toLocaleString()}</Text>
         </View>
         <View style={styles.row}>
           <Text style={{ ...styles.label, fontWeight: 'bold' }}>Total Amount</Text>
           <Text style={{ ...styles.value, fontSize: 14 }}>₦{order.total_amount.toLocaleString()}</Text>
         </View>
       </View>

       <Text style={styles.footer}>
         Thank you for shopping with CEMCS Limited
       </Text>
     </Page>
   </Document>
 );
};

export default Receipt