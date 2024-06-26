import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";

const VanDetail = () => {
  const params = useParams();
  const location = useLocation();
  const [van, setVan] = useState(null);

  useEffect(() => {
    fetch(`/api/vans/${params.id}`)
      .then((res) => res.json())
      .then((data) => setVan(data.vans));
  }, [params.id]);

  const search = location.state?.search || "";
  const backToText = search.split("=")[1];

  return (
    <div className="van-detail-container">
      {van ? (
        <div className="van-detail">
          <Link to={`..${search}`} relative="path" className="back-button">
            &larr;{" "}
            <span>Back to all {search === "?" ? "vans" : `${backToText} vans`}</span>
          </Link>

          <img src={van.imageUrl} />
          <i className={`van-type ${van.type} selected`}>{van.type}</i>
          <h2>{van.name}</h2>
          <p className="van-price">
            <span>${van.price}</span>/day
          </p>
          <p>{van.description}</p>
          <button className="link-button">Rent this van</button>
        </div>
      ) : (
        <h2>Loading...</h2>
      )}
    </div>
  );
};

export default VanDetail;
