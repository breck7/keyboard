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
  addHeatToOldest() {
    const percent = this._age / 4000
    this._jQueryElement.css("color", `rgb(0,0,255,${percent})`)
  }
  addHeatToNewest() {
    const percent = (4000 - this._age) / 4000
    this._jQueryElement.css("color", `rgb(0,0,255,${percent})`)
  }
  removeHeat() {
    this._jQueryElement.css("color", ``)
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

const main = async () => {
  const symbols = []
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
    symbols.forEach(sym => sym[command]())
  })
  //symbols.forEach(sym => sym.replaceWithAge())
}

jQuery(document).ready(main)
