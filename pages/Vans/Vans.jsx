import { useEffect, useState, createElement } from "react";
import { Link, useLoaderData, useSearchParams } from "react-router-dom";
import { getVans } from "../../api";

export function loader() {
  return getVans()
}

export default function Vans() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vans, setVans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const data = useLoaderData();
  console.log(data)

  const typeFilter = searchParams.get("type");

  useEffect(() => {
    async function loadVans() {
      setLoading(true);

      try {
        const data = await getVans();
        setVans(data);
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    loadVans();
  }, []);

  const filteredElements = typeFilter
    ? vans.filter((char) => typeFilter === char.type)
    : vans;

  const vanElements = filteredElements.map((van) => (
    <div key={van.id} className="van-tile">
      <Link
        to={van.id}
        state={{ search: `?${searchParams.toString()}` }}
        aria-label={`View details for ${van.name}, 
                             priced at $${van.price} per day`}
      >
        <img src={van.imageUrl} />
        <div className="van-info">
          <h3>{van.name}</h3>
          <p>
            ${van.price}
            <span>/day</span>
          </p>
        </div>
        <i className={`van-type ${van.type} selected`}>{van.type}</i>
      </Link>
    </div>
  ));

  if (loading) {
    return <h1 aria-live="polite">... Loading</h1>;
  }

  if (error) {
    return <h1 aria-live="assertive">There was an error: {error.message}</h1>
  }

  return (
    <div className="van-list-container">
      <h1>Explore our van options</h1>
      <button
        onClick={() => setSearchParams({ type: "simple" })}
        className={`van-type simple ${
          typeFilter === "simple" ? "selected" : ""
        }`}
      >
        Simple
      </button>
      <button
        onClick={() => setSearchParams({ type: "luxury" })}
        className={`van-type luxury ${
          typeFilter === "luxury" ? "selected" : ""
        }`}
      >
        Luxury
      </button>
      <button
        onClick={() => setSearchParams({ type: "rugged" })}
        className={`van-type rugged ${
          typeFilter === "rugged" ? "selected" : ""
        }`}
      >
        Rugged
      </button>
      {typeFilter ? (
        <button
          onClick={() => setSearchParams({})}
          className="van-type clear-filters"
        >
          Clear filter
        </button>
      ) : null}
      <div className="van-list">{vanElements}</div>
    </div>
  );
}
