const jQuery = $

class Symbol {
  constructor(symbolElement) {
    this._jQueryElement = symbolElement
    let id = symbolElement.attr("value") || symbolElement.text().toLowerCase() + "Symbol"

    this._initData(id)
    this._age = 2020 - this._year
    this._id = id
    this._original = symbolElement.text()
  }
  replaceWithAge() {
    this._jQueryElement.text(this._age)
    this._state = "age"
  }
  hideIfOlderThan(value) {
    if (this._age >= parseInt(value)) this.hide()
    else this.show()
  }
  hideIfYoungerThan(value) {
    if (this._age <= parseInt(value)) this.hide()
    else this.show()
  }
  hide() {
    this._jQueryElement.css("opacity", "0")
    const sib = this.getSibling()
    if (!sib || (sib && sib.isHidden())) this._jQueryElement.parent().css("opacity", "0")
    this._hidden = true
  }
  getSibling() {
    // todo: cleanup
    const sib = this._jQueryElement.siblings()[0]
    if (!sib) return undefined
    const index = parseInt(jQuery(sib).attr("symbol-index"))
    return symbols[index]
  }
  isHidden() {
    return this._hidden === true
  }
  show() {
    this._jQueryElement.css("opacity", "")
    this._jQueryElement.parent().css("opacity", "")
    this._hidden = false
  }
  replaceWithYear() {
    const suffix = this._year < 0 ? "BC" : ""
    this._jQueryElement.text(Math.abs(this._year) + suffix)
    this._state = "year"
  }
  replaceWithOriginal() {
    this._jQueryElement.text(this._original)
    this._state = "original"
  }
  getUrl() {
    return this._url
  }
  _initData(char) {
    // TildaSymbol 1086 https://en.wikipedia.org/wiki/Tilde
    const hit = keyboardTree
      .toString()
      .split("\n")
      .find(line => line.trim().startsWith(char))
    if (hit) {
      const words = hit.trim().split(" ")
      this._url = words[2]
      this._year = parseInt(words[1].replace("~", ""))
    }
  }
}

const symbols = []
const main = async () => {
  jQuery(".key").each(function(index, el) {
    jQuery(this)
      .find("span,b")
      .each(function(symbol) {
        jQuery(this).attr("symbol-index", symbols.length)
        symbols.push(new Symbol(jQuery(this)))
      })
  })
  jQuery(".key span,.key b").on("click", function() {
    const index = parseInt(jQuery(this).attr("symbol-index"))
    const sym = symbols[index]
    window.location = sym.getUrl()
  })
  jQuery("#controls a").on("click", function() {
    const command = jQuery(this).attr("value")
    const argIfAny = jQuery(this).attr("data-arg")
    symbols.forEach(sym => sym[command](argIfAny))
  })
  jQuery("#slider").on("input", function() {
    const val = 4100 - parseInt(jQuery(this).val())
    symbols.forEach(sym => sym.hideIfYoungerThan(val))
  })
  //symbols.forEach(sym => sym.replaceWithAge())
}

jQuery(document).ready(main)
