document.addEventListener("DOMContentLoaded", () => {
  // Close alert messages
  const closeButtons = document.querySelectorAll(".close-btn")
  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const alert = button.parentElement
      alert.style.opacity = "0"
      setTimeout(() => {
        alert.style.display = "none"
      }, 300)
    })
  })

  // Mobile sidebar toggle
  const sidebarToggle = document.querySelector(".sidebar-toggle")
  const sidebar = document.querySelector(".sidebar")

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("active")
    })
  }

  // Dropdown menus
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle")

  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
      e.preventDefault()
      const dropdown = toggle.nextElementSibling
      dropdown.classList.toggle("active")

      // Close other dropdowns
      dropdownToggles.forEach((otherToggle) => {
        if (otherToggle !== toggle) {
          otherToggle.nextElementSibling.classList.remove("active")
        }
      })
    })
  })

  // Close dropdowns when clicking outside
  document.addEventListener("click", (e) => {
    dropdownToggles.forEach((toggle) => {
      const dropdown = toggle.nextElementSibling
      if (!toggle.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove("active")
      }
    })
  })
})

// Form validation
function validateForm(formId) {
  const form = document.getElementById(formId)

  if (!form) return true

  let isValid = true
  const requiredFields = form.querySelectorAll("[required]")

  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      isValid = false
      field.classList.add("error")

      // Add error message if it doesn't exist
      let errorMessage = field.nextElementSibling
      if (!errorMessage || !errorMessage.classList.contains("error-message")) {
        errorMessage = document.createElement("div")
        errorMessage.classList.add("error-message")
        errorMessage.textContent = "This field is required"
        field.parentNode.insertBefore(errorMessage, field.nextSibling)
      }
    } else {
      field.classList.remove("error")

      // Remove error message if it exists
      const errorMessage = field.nextElementSibling
      if (errorMessage && errorMessage.classList.contains("error-message")) {
        errorMessage.remove()
      }
    }
  })

  return isValid
}

// Confirm delete
function confirmDelete(message = "Are you sure you want to delete this item?") {
  return confirm(message)
}

