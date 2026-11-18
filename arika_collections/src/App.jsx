import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './App.css'

const WHATSAPP_NUMBER = '918976192967' // India country code + your WhatsApp number.

const products = [
  { id: 1, slug: 'maharani-haar', name: 'The Maharani Haar', category: 'Necklaces', price: '₹3,850', tag: 'Bestseller', image: 'photo-1611652022419-a9419f74343d', description: 'Antique gold finish · Adjustable dori', detail: 'A statement necklace inspired by the layered haaras worn at royal celebrations. Its antique gold finish and graceful silhouette bring a little ceremony to weddings, festivals, and family gatherings.', details: ['Antique gold finish', 'Adjustable dori fastening', 'Designed for festive and occasion wear'], care: 'Store in a dry, soft pouch. Keep away from perfume, water and moisture.' },
  { id: 2, slug: 'gulabi-chandbalis', name: 'Gulabi Chandbalis', category: 'Earrings', price: '₹1,650', tag: 'Handpicked', image: 'photo-1630019852942-f89202989a59', description: 'Ruby tones · Lightweight for all-day wear', detail: 'A rosy take on the classic chandbali. Ruby-toned accents frame the face beautifully, while a considered lightweight design keeps these comfortable through long celebrations.', details: ['Ruby-toned stone accents', 'Lightweight statement design', 'Traditional chandbali silhouette'], care: 'Wipe gently with a soft dry cloth after wearing and store separately.' },
  { id: 3, slug: 'kolhapuri-saaj', name: 'Kolhapuri Saaj', category: 'Necklaces', price: '₹4,200', tag: '', image: 'photo-1617038220319-276d3cfab638', description: 'A beloved Maharashtrian heirloom style', detail: 'A much-loved Maharashtrian form, reimagined for your own celebrations. The Kolhapuri Saaj is a meaningful finishing touch for a nauvari saree, a festive outfit, or a treasured family occasion.', details: ['Inspired by the traditional Kolhapuri Saaj', 'Warm, heirloom-inspired gold tone', 'Adjustable fastening'], care: 'Keep dry and store flat in its pouch to protect the detailing.' },
  { id: 4, slug: 'temple-jhumkas', name: 'Temple Jhumkas', category: 'Earrings', price: '₹1,890', tag: 'Bestseller', image: 'photo-1535632066927-ab7c9ab60908', description: 'Temple-inspired detail · Warm gold tone', detail: 'Inspired by the carved details of temple jewellery, these jhumkas pair sculptural shapes with a rich, warm gold tone. A lovely choice for a saree, kurta, or your next festive look.', details: ['Temple-inspired detailing', 'Warm gold tone', 'Secure post fastening'], care: 'Avoid contact with water and cosmetics. Store in a soft pouch.' },
  { id: 5, slug: 'nathni-pearl-nath', name: 'Nathni Pearl Nath', category: 'Naths', price: '₹950', tag: 'Made to charm', image: 'photo-1599643478518-a784e5dc4c8f', description: 'Classic Maharashtrian look · Clip-on style', detail: 'The unmistakable charm of a Maharashtrian nath, made easy to wear. This pearl-accented clip-on style lets you complete a traditional look without a piercing.', details: ['Pearl-accented design', 'Clip-on style, no piercing needed', 'Inspired by the Maharashtrian nath'], care: 'Handle gently when clipping on and off. Keep away from moisture.' },
  { id: 6, slug: 'rajwadi-bangles', name: 'Rajwadi Bangles', category: 'Bangles', price: '₹2,250', tag: '', image: 'photo-1611591437281-460bfbe1220a', description: 'Set of 2 · Intricate antique detailing', detail: 'A set of two bangles with old-world detailing and a rich antique finish. Wear them together as a set or style them alongside your everyday favourites.', details: ['Set of 2 bangles', 'Intricate antique-inspired detailing', 'Pairs beautifully with festive outfits'], care: 'Store separately to avoid scratches. Keep away from water and perfume.' },
  { id: 7, slug: 'moti-mangalsutra', name: 'Moti Mangalsutra', category: 'Necklaces', price: '₹2,750', tag: 'New arrival', image: 'photo-1611085583191-a3b181a88401', description: 'Modern heirloom · Black beads and pearls', detail: 'A contemporary heirloom combining the familiar beauty of black beads with soft pearl details. Thoughtfully styled to move between everyday wear and special moments.', details: ['Black beads and pearl accents', 'Modern heirloom-inspired design', 'Adjustable chain'], care: 'Fasten before storing and keep in a dry jewellery box.' },
  { id: 8, slug: 'vaaki-armlet', name: 'Vaaki Armlet', category: 'Bangles', price: '₹1,450', tag: '', image: 'photo-1611652022419-a9419f74343d', description: 'Traditional armlet with floral accents', detail: 'A traditional vaaki armlet finished with delicate floral accents. It adds a graceful detail to festive wear and pairs especially well with sleeveless blouses and classic sarees.', details: ['Traditional vaaki-inspired form', 'Floral accents', 'Adjustable tie fastening'], care: 'Wipe with a soft dry cloth and store untangled in a pouch.' },
]

const categories = ['All pieces', 'Necklaces', 'Earrings', 'Naths', 'Bangles']
const imageUrl = (id, width = 720) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`

function whatsappLink(product) {
  const productPage = `${window.location.origin}/product/${product.slug}`
  const photo = imageUrl(product.image, 1200)
  const message = `Namaste! I’m interested in the ${product.name} (${product.price}) from Arika Collections.\n\nDetails: ${productPage}\nProduct photo: ${photo}\n\nCould you please share more details?`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

function App({ page = 'home', productSlug }) {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('All pieces')
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const selectedProduct = products.find((product) => product.slug === productSlug)
  const [shareFile, setShareFile] = useState(null)

  useEffect(() => {
    let cancelled = false
    setShareFile(null)
    if (page !== 'product' || !selectedProduct) return undefined

    fetch(imageUrl(selectedProduct.image, 1200))
      .then((response) => {
        if (!response.ok) throw new Error('Could not load product photo')
        return response.blob()
      })
      .then((blob) => {
        if (!cancelled) setShareFile(new File([blob], `${selectedProduct.slug}.jpg`, { type: blob.type || 'image/jpeg' }))
      })
      .catch(() => {
        if (!cancelled) setShareFile(null)
      })

    return () => { cancelled = true }
  }, [page, selectedProduct])

  const shareProductPhoto = async () => {
    if (shareFile && navigator.share && navigator.canShare?.({ files: [shareFile] })) {
      try {
        await navigator.share({
          files: [shareFile],
          title: selectedProduct.name,
          text: `Arika Collections · ${selectedProduct.name} · ${selectedProduct.price}\n${window.location.origin}/product/${selectedProduct.slug}`,
        })
        return
      } catch (error) {
        if (error.name === 'AbortError') return
      }
    }
    window.open(whatsappLink(selectedProduct), '_blank', 'noopener,noreferrer')
  }

  const openProduct = (event, product) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    navigate(`/product/${product.slug}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goToCollection = () => {
    navigate('/products')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const filteredProducts = useMemo(() => products.filter((product) => {
    const inCategory = activeCategory === 'All pieces' || product.category === activeCategory
    const matchesSearch = `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(search.toLowerCase())
    return inCategory && matchesSearch
  }), [activeCategory, search])

  return (
    <div className="site-shell">
      <div className="announcement"><span className="announcement-devanagari">शुभमस्तु</span><span className="announcement-dot">✦</span> A little tradition, a lot of love <span className="announcement-dot">✦</span> Free shipping on orders above ₹2,499</div>
      <header className="header">
        <button className="mobile-menu" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? '✕' : '☰'}</button>
        <Link className="wordmark" to="/" aria-label="Arika Collections home"><span className="wordmark-main">arika</span><span className="wordmark-sub">COLLECTIONS</span></Link>
        <nav className={menuOpen ? 'nav nav-open' : 'nav'}>
          <Link to="/products" onClick={() => setMenuOpen(false)}>All products</Link><Link to="/#story" onClick={() => setMenuOpen(false)}>Our story</Link><Link to="/#footer" onClick={() => setMenuOpen(false)}>Contact</Link>
        </nav>
        <Link className="header-cta" to="/#collection">Explore the edit <span>↗</span></Link>
      </header>

      {page === 'product' ? selectedProduct ? <main id="top" className="detail-page">
        <div className="detail-breadcrumb"><button onClick={goToCollection}>← &nbsp; Back to all jewellery</button><span>Home / {selectedProduct.category} / {selectedProduct.name}</span></div>
        <section className="detail-layout">
          <div className="detail-photo"><img src={imageUrl(selectedProduct.image, 1200)} alt={selectedProduct.name} /><span className="detail-photo-caption">ARIKA COLLECTIONS · ROOTED IN TRADITION</span></div>
          <div className="detail-copy"><div className="eyebrow">{selectedProduct.category} · ARIKA EDIT</div><h1>{selectedProduct.name}</h1><div className="detail-price">{selectedProduct.price} <span>INR</span></div><p className="detail-description">{selectedProduct.detail}</p><div className="detail-divider" />
            <div className="detail-highlights"><h2>A piece to treasure</h2>{selectedProduct.details.map((detail) => <div key={detail}><span>✳</span>{detail}</div>)}</div>
            <div className="detail-care"><h2>Care, with love</h2><p>{selectedProduct.care}</p></div>
            <button className="detail-whatsapp" type="button" onClick={shareProductPhoto}><span>◉</span> Share photo &amp; details <b>↗</b></button>
            <a className="detail-whatsapp direct-whatsapp" href={whatsappLink(selectedProduct)} target="_blank" rel="noreferrer">Open WhatsApp enquiry <b>↗</b></a>
            <p className="detail-footnote">Ask us about availability, sizing, customisation and delivery. We’ll be happy to help.</p>
          </div>
        </section>
        <section className="detail-more"><div className="eyebrow">A LITTLE MORE TO LOVE</div><h2>Explore the collection</h2><button onClick={goToCollection}>Browse all pieces <span>↗</span></button></section>
      </main> : <main id="top" className="not-found-page"><div><h1>Piece not found</h1><p>We couldn’t find that jewellery piece.</p><button onClick={goToCollection}>Browse all products ↗</button></div></main> : page === 'products' ? <main id="top" className="all-products-page">
        <section className="all-products-heading"><div className="eyebrow">ARIKA COLLECTIONS · ROOTED IN MAHARASHTRA</div><h1>All Products<span>.</span></h1><p>Find a piece for every celebration, and every day in between.</p></section>
        <section className="collection section-wrap" id="collection">
          <div className="catalogue-tools"><div className="category-list" role="tablist" aria-label="Filter by jewellery category">{categories.map((category) => <button key={category} className={activeCategory === category ? 'category active' : 'category'} onClick={() => setActiveCategory(category)}>{category}</button>)}</div><label className="search-box"><span>⌕</span><input aria-label="Search jewellery" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search jewellery" /></label></div>
          {filteredProducts.length ? <div className="product-grid">{filteredProducts.map((product, index) => <article className="product-card" key={product.id}>
            <a className="product-image" href={`/product/${product.slug}`} onClick={(event) => openProduct(event, product)} aria-label={`View ${product.name} details`}><img src={imageUrl(product.image)} alt={product.name} loading="lazy" />{product.tag && <span className="product-tag">{product.tag}</span>}<span className="image-index">0{index + 1}</span><span className="image-arrow">↗</span></a>
            <div className="product-info"><div><span className="product-category">{product.category}</span><h3><a href={`/product/${product.slug}`} onClick={(event) => openProduct(event, product)}>{product.name}</a></h3><p>{product.description}</p></div><span className="price">{product.price}</span></div>
            <a className="whatsapp-link" href={whatsappLink(product)} target="_blank" rel="noreferrer"><span className="wa-icon">◉</span> Enquire on WhatsApp <span className="link-arrow">↗</span></a>
          </article>)}</div> : <div className="empty-state">No pieces found. Try another search or category.</div>}
          <p className="catalogue-note">Prices shown in INR. Message us on WhatsApp for availability, customisation and delivery details.</p>
        </section>
      </main> : <main id="top">
        <section className="hero">
          <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line" /> ROOTED IN MAHARASHTRA</div><h1>Adornment with<br /><em>a story to tell.</em></h1><p>Jewellery that carries the warmth of tradition and the joy of being entirely you.</p><a className="button button-dark" href="#collection">Find your forever piece <span>↗</span></a><div className="hero-note"><span className="note-star">✳</span><span>Made for your moments<br />and all the ones to come</span></div></div>
          <div className="hero-visual"><img src={imageUrl('photo-1611652022419-a9419f74343d', 1200)} alt="Traditional gold jewellery styled for a celebration" /><div className="hero-stamp"><span>ROOTED IN<br />TRADITION</span><b>✳</b><span>MADE TO<br />BE YOURS</span></div><div className="hero-caption">THE ARIKA FESTIVE EDIT <span>— 01 / 04</span></div></div>
        </section>
        <section className="trust-strip" aria-label="Our promise"><div><span>✳</span> Thoughtfully curated</div><i /><div><span>✳</span> Made for celebrations</div><i /><div><span>✳</span> Enquire directly on WhatsApp</div></section>
        <section className="collection section-wrap" id="collection">
          <div className="section-heading"><div><div className="eyebrow">THE ARIKA EDIT</div><h2>Pieces to <em>keep close.</em></h2></div><p>From everyday heirlooms to your most-awaited occasions, find the piece that feels like you.</p></div>
          <div className="catalogue-tools"><div className="category-list" role="tablist" aria-label="Filter by jewellery category">{categories.map((category) => <button key={category} className={activeCategory === category ? 'category active' : 'category'} onClick={() => setActiveCategory(category)}>{category}</button>)}</div><label className="search-box"><span>⌕</span><input aria-label="Search jewellery" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find your piece" /></label></div>
          {filteredProducts.length ? <div className="product-grid">{filteredProducts.map((product, index) => <article className="product-card" key={product.id}>
            <a className="product-image" href={`/product/${product.slug}`} onClick={(event) => openProduct(event, product)} aria-label={`View ${product.name} details`}><img src={imageUrl(product.image)} alt={product.name} loading="lazy" />{product.tag && <span className="product-tag">{product.tag}</span>}<span className="image-index">0{index + 1}</span><span className="image-arrow">↗</span></a>
            <div className="product-info"><div><span className="product-category">{product.category}</span><h3><a href={`/product/${product.slug}`} onClick={(event) => openProduct(event, product)}>{product.name}</a></h3><p>{product.description}</p></div><span className="price">{product.price}</span></div>
            <a className="whatsapp-link" href={whatsappLink(product)} target="_blank" rel="noreferrer"><span className="wa-icon">◉</span> Enquire on WhatsApp <span className="link-arrow">↗</span></a>
          </article>)}</div> : <div className="empty-state">No pieces found. Try another search or category.</div>}
          <p className="catalogue-note">Prices shown in INR. Message us on WhatsApp for availability, customisation and delivery details.</p>
        </section>
        <section className="story" id="story"><div className="story-image"><img src={imageUrl('photo-1617038220319-276d3cfab638', 1000)} alt="Intricate traditional jewellery details" loading="lazy" /><span>OUR LITTLE WORLD, IN GOLD</span></div><div className="story-copy"><div className="eyebrow">A NOTE FROM ARIKA</div><h2>Old-world soul.<br /><em>Everyday magic.</em></h2><p>We believe jewellery is more than what you wear. It’s the nath your aaji saved for you, the earrings you reach for before a celebration, and the little things that make a moment yours.</p><p>Arika brings together traditional Maharashtrian designs and pieces made for the way we live today. Each one is chosen with care, and sent with love.</p><a className="text-link" href="#collection">Meet your new favourite <span>↗</span></a><div className="story-flower">✳</div></div></section>
        <section className="closing-cta"><span className="closing-flower">✳</span><div className="eyebrow">YOUR NEXT HEIRLOOM IS HERE</div><h2>Some things just <em>feel like you.</em></h2><a className="button button-light" href="#collection">Find your piece <span>↗</span></a></section>
      </main>}
      <footer id="footer"><Link className="wordmark footer-mark" to="/"><span className="wordmark-main">arika</span><span className="wordmark-sub">COLLECTIONS</span></Link><p>Tradition, with a little more you.</p><span className="footer-copy">© 2025 Arika Collections</span><Link className="footer-top" to="/#top">BACK TO TOP ↑</Link></footer>
      <a className="floating-wa" href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Namaste! I’d love to know more about Arika Collections.')}`} target="_blank" rel="noreferrer" aria-label="Chat with Arika Collections on WhatsApp"><span>◉</span><b>Let’s chat</b></a>
    </div>
  )
}

export default App
