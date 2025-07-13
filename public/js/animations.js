document.addEventListener("DOMContentLoaded", () => {
  // Staggered animations for lists
  const animateItems = document.querySelectorAll(".animate-stagger")

  if (animateItems.length > 0) {
    animateItems.forEach((item, index) => {
      item.style.animationDelay = `${index * 0.1}s`
    })
  }

  // Intersection Observer for scroll animations
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  }

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-visible")
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  const scrollAnimElements = document.querySelectorAll(".animate-on-scroll")
  scrollAnimElements.forEach((element) => {
    element.classList.add("animate-hidden")
    observer.observe(element)
  })

  // Form field animations
  const formFields = document.querySelectorAll("input, select, textarea")

  formFields.forEach((field) => {
    // Add focus animation
    field.addEventListener("focus", () => {
      field.parentElement.classList.add("field-focused")
    })

    // Remove focus animation
    field.addEventListener("blur", () => {
      field.parentElement.classList.remove("field-focused")
    })

    // Add animation when field has value
    field.addEventListener("input", () => {
      if (field.value.trim() !== "") {
        field.classList.add("has-value")
      } else {
        field.classList.remove("has-value")
      }
    })

    // Check initial value
    if (field.value.trim() !== "") {
      field.classList.add("has-value")
    }
  })

  // Button hover effects
  const buttons = document.querySelectorAll(".btn")

  buttons.forEach((button) => {
    button.addEventListener("mouseenter", () => {
      button.classList.add("btn-hover")
    })

    button.addEventListener("mouseleave", () => {
      button.classList.remove("btn-hover")
    })
  })

  // Card hover animations
  const cards = document.querySelectorAll(".feature-card, .dashboard-card, .customer-row")

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.classList.add("card-hover")
    })

    card.addEventListener("mouseleave", () => {
      card.classList.remove("card-hover")
    })
  })

  // Notification animations
  function showNotification(message, type = "success") {
    const notification = document.createElement("div")
    notification.className = `notification notification-${type} animate-slide-in`
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-${type === "success" ? "check-circle" : type === "error" ? "exclamation-circle" : "info-circle"}"></i>
        <span>${message}</span>
      </div>
      <button class="notification-close">&times;</button>
    `

    document.body.appendChild(notification)

    // Auto-remove after 5 seconds
    setTimeout(() => {
      notification.classList.add("notification-hide")
      setTimeout(() => {
        notification.remove()
      }, 300)
    }, 5000)

    // Close button
    const closeButton = notification.querySelector(".notification-close")
    closeButton.addEventListener("click", () => {
      notification.classList.add("notification-hide")
      setTimeout(() => {
        notification.remove()
      }, 300)
    })
  }

  // Expose the function globally
  window.showNotification = showNotification
})

// Add CSS for scroll animations
const style = document.createElement("style")
style.textContent = `
  .animate-hidden {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  
  .animate-visible {
    opacity: 1;
    transform: translateY(0);
  }
  
  .field-focused {
    transform: translateY(-2px);
  }
  
  .btn-hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .card-hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
  
  .notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px;
    border-radius: 4px;
    background-color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 1000;
    min-width: 300px;
    max-width: 400px;
  }
  
  .notification-content {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .notification-success {
    border-left: 4px solid #10b981;
  }
  
  .notification-error {
    border-left: 4px solid #ef4444;
  }
  
  .notification-info {
    border-left: 4px solid #3b82f6;
  }
  
  .notification-hide {
    opacity: 0;
    transform: translateX(100%);
    transition: opacity 0.3s ease, transform 0.3s ease;
  }
  
  .notification-close {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: #64748b;
  }
`

document.head.appendChild(style)

