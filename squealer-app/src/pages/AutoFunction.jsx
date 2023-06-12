import { useState, useRef } from "react";
import { useForm } from "react-hook-form";

function AutoPage() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  // const [showNameErr, setShowNameErr] = useState(false);

  const onSubmit = async (data) => {
    console.log(data);
    let msg = await createChannel(data.targetChannel);
    console.log(msg);
    setupTimer(data);
  };

  const createChannel = async (name) => {
    const res = await fetch(`http://localhost:3000/channels/create`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: localStorage.token,
      },
      body: JSON.stringify({ name: name }),
    });
    const data = await res.json();
    console.log(data);
    return data;
  };

  function getGeolocation() {
    return new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject)
    );
  }

  async function getLongAndLat() {
    const { coords } = await getGeolocation();
    return { lat: coords.latitude, lon: coords.longitude };
  }

  const setupTimer = (data) => {
    clearInterval(localStorage.getItem("lastTimer"));
    localStorage.setItem(
      "lastTimer",
      setInterval(() => {
        const newPost = {
          //sender will be derived from the JWT
          recipients: [data.targetChannel],
          text: messageParsing(data.message),
          timestamp: Date.now(),
          //geolocation: await getLongAndLat(),
        };

        console.log(Number(data.period) * 1000);

        fetch(`http://localhost:3000/post`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: localStorage.token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPost),
        });
      }, Number(data.period) * 1000)
    );
  };

  const messageParsing = (msg) => {
    return msg;
  };

  return (
    <div className="flex flex-col items-center my-8 mx-8 md:max-w-5xl md:mx-auto gap-y-8">
      <h1 className="text-5xl md:text-6xl font-semibold">Automatic Messages</h1>
      <p className="text-md md:text-xl">
        Here you can set up an{" "}
        <span className="bg-yellow-400 text-black">
          Automatic Message Generator.
        </span>{" "}
        The target channel is the channel where the Posts will be sent (must
        start with a "#"). Then you specify the frequency (period) and after
        that you need to write the message! To remove this functionality use the
        "remove sending button"
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-y-6"
      >
        <div className="flex gap-x-16 items-center justify-center flex-wrap gap-y-10">
          <div className="flex flex-col gap-y-4">
            <label htmlFor="target-channel" className="text-xl">
              Target Channel
            </label>
            <input
              className="input input-bordered input-primary"
              type="text"
              id="target-channel"
              {...register("targetChannel", {
                required: "Specify the target channel",
                pattern: {
                  value: /^#/,
                  message: "Channel must start with '#'",
                },
              })}
            />
            {(errors.targetChannel?.type === "required" ||
              errors.targetChannel?.type === "pattern") && (
              <p role="alert">{errors.targetChannel?.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-y-4">
            <label htmlFor="period" className="text-xl">
              Period
            </label>
            <select
              id="period "
              className="select select-primary"
              {...register("period")}
            >
              <option value={5}>5 sec</option>

              <option value={30}>30 sec</option>
              <option value={60}>1 min</option>
              <option value={60 * 5}>5 min</option>
              <option value={60 * 10}>10 min</option>
            </select>
          </div>

          <div className="flex flex-col gap-y-4">
            <label htmlFor="message" className="text-xl">
              Message
            </label>
            <textarea
              {...register("message", {
                required: "Specify the message format",
              })}
              className="textarea input-bordered input-primary w-64"
              placeholder="I'm cool at {TIME}"
            ></textarea>
            {errors.message?.type === "required" && (
              <p role="alert">{errors.message?.message}</p>
            )}
          </div>
        </div>

        <input className="btn w-fit" type="submit" value="SET UP!" />
      </form>

      <button
        className="btn"
        onClick={() => {
          clearInterval(localStorage.getItem("lastTimer"));
        }}
      >
        remove sending
      </button>
    </div>
  );
}

export default AutoPage;
