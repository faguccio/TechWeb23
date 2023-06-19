import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Const } from "../utils";

function CreateChannelPage() {
  const [readerList, setReaderList] = useState([]);
  const [writerList, setWriterList] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const {
    register: register2,
    formState: { errors: errors2 },
    handleSubmit: handleSubmit2,
  } = useForm();
  const {
    register: register3,
    formState: { errors: errors3 },
    handleSubmit: handleSubmit3,
  } = useForm();

  const onSubmit = async (data) => {
    const newChannel = {
      name: data.channelName,
      allowed_readers: readerList,
      allowed_writers: writerList,
    };
    console.log(newChannel);
    let res = await fetch(`${Const.apiurl}/channels/create`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: localStorage.token,
      },
      body: JSON.stringify(newChannel),
    });

    res = await res.json();
    if (res.status == "success") {
      setShowSuccess(true);
    }
  };

  return (
    <div className="flex flex-col items-center my-8 mx-8 md:max-w-5xl md:mx-auto gap-y-82">
      <div className="flex gap-x-16 items-center justify-center flex-wrap gap-y-10">
        <form
          onSubmit={handleSubmit2((data) => {
            if (readerList.includes(data.reader)) return;
            setReaderList(readerList.concat([data.reader]));
          })}
          className="flex flex-col gap-y-4"
        >
          <label htmlFor="reader" className="text-xl">
            Allowed readers
          </label>
          <div className="flex flex-row">
            <input
              className="input input-bordered input-primary"
              type="text"
              id="reader"
              {...register2("reader")}
            />
            <input className="btn ml-2" type="submit" value="ADD!" />
          </div>

          <div className="flex flex-col">
            {readerList.map((reader) => {
              return (
                <div className="flex flex-row items-center">
                  <a>{reader}</a>
                  <button
                    className="btn scale-50 btn-circle btn-outline"
                    onClick={(e) => {
                      e.preventDefault();
                      setReaderList(
                        readerList.filter((x) => {
                          return x != reader;
                        })
                      );
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        </form>
        <form
          onSubmit={handleSubmit3((data) => {
            if (writerList.includes(data.writer)) return;
            setWriterList(writerList.concat([data.writer]));
          })}
          className="flex flex-col gap-y-4"
        >
          <label htmlFor="writer" className="text-xl">
            Allowed writers
          </label>
          <div className="flex flex-row">
            <input
              className="input input-bordered input-primary"
              type="text"
              id="writer"
              {...register3("writer")}
            />
            <input className="btn ml-2" type="submit" value="ADD!" />
          </div>
          <div className="flex flex-col">
            {writerList.map((writer) => {
              return (
                <div className="flex flex-row items-center">
                  <a>{writer}</a>
                  <button
                    className="btn scale-50 btn-circle btn-outline"
                    onClick={(e) => {
                      e.preventDefault();
                      setWriterList(
                        writerList.filter((x) => {
                          return x != writer;
                        })
                      );
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        </form>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center gap-y-6"
        >
          <div className="flex flex-col gap-y-4">
            <label htmlFor="channel-name" className="text-xl">
              Channel Name
            </label>
            <input
              className="input input-bordered input-primary"
              type="text"
              id="channel-name"
              {...register("channelName", {
                required: "Specify the channel name you wish to create",
                pattern: {
                  value: /^(#|§)/,
                  message: "Channel must start with '#' or with '§'",
                },
              })}
            />
            {(errors.channelName?.type === "required" ||
              errors.channelName?.type === "pattern") && (
              <p role="alert">{errors.channelName?.message}</p>
            )}
          </div>
          <div
            className={` alert alert-success ${
              showSuccess ? "flex" : "hidden"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Channel creation ended successfully!</span>
          </div>
          <input className="btn" type="submit" value="CREATE!" />
        </form>
      </div>
    </div>
  );
}

export default CreateChannelPage;
