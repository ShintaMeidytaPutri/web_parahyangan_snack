document.addEventListener('alpine:init', () => {
    Alpine.data('products', () => ({
        items: [
            { id: 1, name: 'Basreng Bawang', img: 'basreng_p.jpg', price: 15000},
            { id: 2, name: 'Basreng Pedas', img: 'basreng_p.jpg', price: 15000},
            { id: 3, name: 'Basreng Pedas Daun Jeruk', img: 'basreng_p.jpg', price: 15000},
            { id: 4, name: 'Batagor Bawang', img: 'batagor_p.jpg', price: 15000},
            { id: 5, name: 'Batagor Pedas', img: 'batagor_p.jpg', price: 15000},
            { id: 6, name: 'Batagor Pedas Daun Jeruk', img: 'batagor_p.jpg', price: 15000},
            { id: 7, name: 'Makaroni Bawang', img: 'makaroni_p.jpg', price: 15000},
            { id: 8, name: 'Makaroni Pedas', img: 'makaroni_p.jpg', price: 15000},
            { id: 9, name: 'Makaroni Pedas Daun Jeruk', img: 'makaroni_p.jpg', price: 15000},
            { id: 10, name: 'Seblak Bawang', img: 'seblak_p.jpg', price: 15000},
            { id: 11, name: 'Seblak Pedas', img: 'seblak_p.jpg', price: 15000},
            { id: 12, name: 'Seblak Pedas Daun Jeruk', img: 'seblak_p.jpg', price: 15000},
            { id: 13, name: 'Usus Bawang Daun Jeruk', img: 'usus_p.jpg', price: 15000},
            { id: 14, name: 'Usus Pedas Daun Jeruk', img: 'usus_p.jpg', price: 15000},
            { id: 15, name: 'Basreng Karedok Pedas Biasa', img: 'karedok_p.jpg', price: 8000},
            { id: 16, name: 'Basreng Karedok Pedas Luar Biasa', img: 'karedok_p.jpg', price: 8000},
        ],
      
    }));


    Alpine.store('cart', {
        items: [], 

        total: 0,

        quantity: 0,
        add(newItem) {
            //cek barang yang sama
            const cartItem = this.items.find((item) => item.id === newItem.id);

            //jika belum ada / cart kosong
            if(!cartItem) {
                this.items.push({...newItem, quantity: 1, total: newItem.price});
                this.quantity++;
                this.total += newItem.price;
            } else {
                //jika barang sudah ada. cek apakah barang beda atau sama dengan yang ada di cart
                this.items = this.items.map((item) => {
                    // jika barang berbeda
                    if(item.id !== newItem.id){
                        return item;
                    } else {
                        //jika barang sudah ada, tambah quantity dan total
                        item.quantity++;
                        item.total = item.price * item.quantity;
                        this.quantity++;
                        this.total += item.price;
                        return item;
                    }
                });
            }
           
        },
        remove(id) {
            // ambil item yang di remove berdasarkan id nya
            const cartItem = this.items.find((item) => item.id === id);

            //jika item lebih dari 1
            if(cartItem.quantity > 1) {
                //telusuri satu satu
                this.items = this.items.map((item) => {
                    // jika bukan barang yang diklik
                    if(item.id !== id ) {
                        return item;
                    } else {
                        item.quantity--;
                        item.total = item.price * item.quantity;
                        this.quantity--;
                        this.total -= item.price;
                        return item;
                    }
                })
            } else if (cartItem.quantity === 1) {
                // jika barangnya sisa 1
                this.items = this.items.filter((item) => item.id !== id);
                this.quantity--;
                this.total -= cartItem.price;
            }
        }
    });
});


// Form Validasi
const checkoutButton = document.querySelector('.checkout-button');
checkoutButton.disabled = true;

const form = document.querySelector('#checkout-form');

form.addEventListener('keyup', function() {
    for(let i = 0; i < form.elements.length; i++) {
        if(form.elements[i].value.length !== 0) {
            checkoutButton.classList.remove('disabled');
            checkoutButton.classList.add('disabled');
        }else {
            return false;
        }
    }
    checkoutButton.disabled = false;
    checkoutButton.classList.remove('disabled');
});

//Mengirim data pada saat klik checkout
checkoutButton.addEventListener('click', async function(e) {
    e.preventDefault();
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);
    const objData = Object.fromEntries(data);
    
    //mengambil token transaksi menggunakan ajax /fetch
    try {
        const response = await fetch('php/placeOrder.php', {
            method: 'POST',
            body: data,
        });
        const token = await response.text();
        //console.log(token);
        window.snap.pay(token);
    } catch(err) {
        console.log(err.message);
    }

   
});

//konversi mata uang indonesia//
const rupiah = (number) => {
    return new Intl.NumberFormat(`id-ID`, {
        style: `currency`,
        currency: `IDR`,
        minimumFractionDigits: 0,
    }).format(number);
};


