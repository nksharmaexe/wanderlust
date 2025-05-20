const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist :(");
    return res.redirect("/listings");
  }
  // console.log(listing);
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
  const newListing = new Listing(req.body.listing);

  const query = req.body.listing.location;
  const apiKey = process.env.MAP_KEY;
  const geoCodingUrl = `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=${apiKey}`;

  try {
    const response = await fetch(geoCodingUrl);
    const data = await response.json();
    if (data.features.length > 0) {
      newListing.coordinates = data.features[0].geometry.coordinates;
    } else {
      console.error("No coordinates found for location");
    }
  } catch (error) {
    console.error("Error fetching geocode:", error);
  }

  let url = req.file.path;
  let filename = req.file.filename;
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();

  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};


// module.exports.createListing = async (req, res) => {
//   const newListing = new Listing(req.body.listing);

//   const query = req.body.listing.location;
//   const apiKey = process.env.MAP_KEY;
//   const geoCodingUrl = `https://api.maptiler.com/geocoding/${encodeURIComponent(
//     query
//   )}.json?key=${apiKey}`;

//   fetch(geoCodingUrl)
//     .then((response) => response.json())
//     .then((data) => {
//       let locCoordinates = data.features[0].geometry.coordinates;
//       newListing.coordinates = locCoordinates;
//     })
//     .catch((error) => console.error("Error fetching geocode:", error));

//   let url = req.file.path;
//   let filename = req.file.filename;
//   newListing.owner = req.user._id;
//   newListing.image = { url, filename };
//   await newListing.save();
//   req.flash("success", "New Listing Created");
//   res.redirect("/listings");
// };

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist :(");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};

// Query Results
module.exports.queryResult = async (req, res) => {
  let { q } = req.query;
  const allListings = await Listing.find({
    $or: [{ location:{ $regex: q, $options: 'i' }}, { country: { $regex: q, $options: 'i' }}],
  });
  res.render("listings/index.ejs", { allListings });
}
// Filter Result
module.exports.filterResult = async(req,res)=>{
  let {filter} = req.params;
  let allListings = await Listing.find({category:filter});
  res.render("listings/index.ejs", { allListings });
}