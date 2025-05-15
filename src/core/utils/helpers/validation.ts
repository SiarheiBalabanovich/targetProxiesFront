export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const formatPhoneNumber = (phoneNumber: string): string => {
  let value = phoneNumber.replace(/\D/g, '') // Заменяем все нецифровые символы на пустую строку
  value = value.replace(
    /^(\d{3})(\d{2})(\d{3})(\d{4})/,
    function (_, p1, p2, p3, p4) {
      let result = '___ __ _______'
      if (p1 !== null) result = p1
      if (p2 !== null) result += ' ' + p2
      if (p3 !== null) result += ' ' + p3
      if (p4 !== null) result += ' ' + p4
      return result
    },
  )
  return value
}
