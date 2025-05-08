// Espera a página carregar completamente antes de rodar o código
document.addEventListener('DOMContentLoaded', () => {

    // Pega os botões e elementos do HTML que vamos usar
    const addToCartBtn       = document.getElementById('add-to-cart-btn');      // Botão "Adicionar ao Carrinho"
    const buyNowBtn          = document.getElementById('buy-now-btn');          // Botão "Comprar Agora"
    const toast              = document.getElementById('toast');                // Caixinha que mostra avisos rápidos
    const cartKey            = 'bubbleMixCart';                                 // Nome da "chave" que usamos no localStorage
    const cartItemCountSpan  = document.getElementById('cart-item-count');      // Onde mostra quantos itens tem no carrinho
    const cartTotalPriceSpan = document.getElementById('cart-total-price');     // Onde mostra o preço total do carrinho
    const cartListUl         = document.getElementById('cart-list');            // A lista com os itens do carrinho
    const emptyCartMessage   = document.getElementById('empty-cart-message');   // Mensagem quando o carrinho estiver vazio
    const teaOptions         = document.querySelectorAll('#cha-options article'); // Todos os chás da página

    // Aqui limpa o carrinho toda vez que recarrega (só para testes mesmo)
    localStorage.removeItem(cartKey);
    updateCartPreview();  // Atualiza o número e total no topo
    displayCartItems();   // Mostra os itens na lista do carrinho

    // Função que pega os chás que o usuário escolheu
    function getSelectedItems() {
        const items = [];

        // Passa por cada chá da página
        teaOptions.forEach(tea => {
            const name       = tea.querySelector('h3').textContent;          // Nome do chá
            const price      = parseFloat(tea.dataset.price);                // Preço do chá
            const qtyInput   = tea.querySelector('input[type="number"]');    // Campo de quantidade
            const selectBoba = tea.querySelector('select');                  // Bolinhas (sabor)
            const qty        = parseInt(qtyInput.value, 10);                 // Quantidade escolhida
            const sabor      = selectBoba.value;                             // Sabor escolhido

            // Só adiciona se a quantidade for maior que 0
            if (qty > 0) {
                items.push({
                    name,
                    quantity: qty,
                    price,
                    hasBoba: sabor !== '',      // Diz se escolheu bolinha ou não
                    saborBoba: sabor || null    // Guarda o sabor da bolinha, se tiver
                });
            }
        });

        return items; // Retorna a lista dos chás escolhidos
    }

    // Salva os itens no carrinho (no localStorage)
    function saveCart(cartItems) {
        localStorage.setItem(cartKey, JSON.stringify(cartItems)); // Salva os dados como texto
        updateCartPreview();  // Atualiza o número e total do carrinho no topo
        displayCartItems();   // Mostra os itens no carrinho
    }

     //Mostra uma mensagem rápida na tela
    function showToast(msg) {
        toast.textContent = msg;
toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000); // Some depois de 3 segundos
    }

    // Atualiza o número de itens e o total do carrinho que aparece no topo
    function updateCartPreview() {
        const stored = JSON.parse(localStorage.getItem(cartKey) || '[]'); // Pega o carrinho salvo

        const totalQty   = stored.reduce((sum, i) => sum + i.quantity, 0);         // Soma todas as quantidades
        const totalPrice = stored.reduce((sum, i) => sum + i.quantity * i.price, 0); // Soma todos os preços

        cartItemCountSpan.textContent  = totalQty;                                 // Mostra quantidade
        cartTotalPriceSpan.textContent = totalPrice.toFixed(2).replace('.', ',');  // Mostra total com vírgula
    }

     //Função para apagar o carrinho
    function clearCart() {
        localStorage.removeItem(cartKey);  // Remove os itens do localStorage
        updateCartPreview();               // Atualiza o topo
      displayCartItems();                // Atualiza a lista
    }

    // Mostra os itens que estão no carrinho na lista da página
    function displayCartItems() {
        cartListUl.innerHTML = ''; // Limpa a lista primeiro

        const stored = JSON.parse(localStorage.getItem(cartKey) || '[]'); // Pega o carrinho salvo

        // Calcula o total e mostra no resumo
        const total = stored.reduce((sum, i) => sum + i.quantity * i.price, 0);
        document.getElementById('cart-list-total')
                .textContent = total.toFixed(2).replace('.', ',');

        // Se não tiver nada no carrinho, mostra a mensagem de vazio
        if (stored.length === 0) {
            emptyCartMessage.style.display = 'block';
            return;
        }

        // Se tiver itens, esconde a mensagem
        emptyCartMessage.style.display = 'none';

        // Adiciona cada item na lista
        stored.forEach(item => {
            const subtotal = (item.price * item.quantity).toFixed(2).replace('.', ','); // Preço do item vezes a quantidade
            const bobaText = item.hasBoba
                ? ` com bolinhas de ${item.saborBoba}`   // Se tiver bolinhas, mostra o sabor
                : '';
            const li = document.createElement('li');
            li.textContent = `${item.name} (x${item.quantity})${bobaText} – R$ ${subtotal}`;
            cartListUl.appendChild(li);
        });
    }

    // Quando clicar no botão "Adicionar ao Carrinho"
    addToCartBtn.addEventListener('click', () => {
        const sel = getSelectedItems(); // Pega os chás escolhidos
        if (sel.length) {
            saveCart(sel);  // Salva no carrinho
            showToast('Item(ns) adicionado(s) ao carrinho!');
        } else {
            showToast('Selecione ao menos um chá.'); // Se não escolheu nada
        }
    });

    // Quando clicar no botão "Comprar Agora"
    buyNowBtn.addEventListener('click', () => {
        const sel = getSelectedItems(); // Pega os chás escolhidos
        if (sel.length) {
            const confirmacao = confirm('Deseja realmente prosseguir para o pagamento?'); // Pergunta se quer continuar
            if (confirmacao) {
                saveCart(sel);                       // Salva o carrinho
                window.location.href = 'payment.html'; // Vai para a página de pagamento
            }
        } else {
            showToast('Selecione ao menos um chá para comprar.'); // Se não escolheu nada
        }
    });
});
