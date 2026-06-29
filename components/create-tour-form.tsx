"use client";

import type { Dispatch, SetStateAction, SubmitEvent } from "react";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "./ui/textarea";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type Itinerary = {
  activities: string[];
  subtitle: string;
  day: string;
  image: File | null;
};

const initialItineraryData = (day: number) => [{
  activities: [''],
  subtitle: '',
  day: `Day ${day}`,
  image: null
}]

export default function CreateTourForm() {
  const [loading, setLoading] = useState(false);

  const [description, setDescription] = useState<string>('');
  const [activities, setActivities] = useState<string[]>(['']);
  const [included, setIncluded] = useState<string[]>(['']);
  const [excluded, setExcluded] = useState<string[]>(['']);
  const [title, setTitle] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [dates, setDates] = useState<string>('');
  const [groupSize, setGroupSize] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [tourImage, setTourImage] = useState<File | null>(null);
  const [itineraries, setItineraries] = useState<Itinerary[]>(initialItineraryData(1));
  const [duration, setDuration] = useState<string>('');

  const handleArrayChange = (
    setter: Dispatch<SetStateAction<string[]>>,
    index: number,
    value: string
  ) => {
    setter(prev => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  }

  const addField = (
    setter: Dispatch<SetStateAction<string[]>>
  ) => {
    return setter(prev => [...prev, ''])
  }

  const removeField = (
    setter: Dispatch<SetStateAction<string[]>>,
    index: number
  ) => {
    setter(prev => [...prev].filter((_, i) => i !== index))
  }

  const addItinerary = (day: number) => {
    return setItineraries(prev => [...prev, ...initialItineraryData(day)])
  }

  const removeItinerary = (
    itineraryId: number
  ) => {
    return setItineraries(itineraries => [...itineraries].filter((_, i) => i !== itineraryId));
  }

  const handleItinerarySubtitle = (
    itineraryId: number,
    value: string,
  ) => {
    return setItineraries(prev => {
      const copy = [...prev];
      copy[itineraryId] = { ...copy[itineraryId], subtitle: value };
      return copy;
    })
  }

  const handleItineraryImage = (
    itineraryId: number,
    file: File,
  ) => {
    setItineraries(prev => {
      const copy = [...prev];
      copy[itineraryId] = { ...copy[itineraryId], image: file };
      return copy;
    })
  }

  const handleItineraryActivity = (
    itineraryId: number,
    activityId: number,
    value: string,
  ) => {
    setItineraries(prev => {
      const copy = [...prev];
      copy[itineraryId] = { ...copy[itineraryId] };
      copy[itineraryId].activities = [...copy[itineraryId].activities];
      copy[itineraryId].activities[activityId] = value;
      return copy;
    })
  }

  const addItineraryActivityField = (itineraryId: number) => {
    setItineraries(prev => {
      const copy = [...prev];
      copy[itineraryId] = {
        ...copy[itineraryId],
        activities: [...copy[itineraryId].activities, '']
      }
      return copy;
    })
  }

  const removeItineraryActivityField = (itineraryId: number, activityId: number) => {
    setItineraries(prev => {
      const copy = [...prev];
      copy[itineraryId] = {
        ...copy[itineraryId],
        activities: [...copy[itineraryId].activities].filter((_, i) => i !== activityId)
      }
      return copy;
    })
  }


  async function submitForm(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    // console.log('Description:', description);
    // console.log('Activities:')
    // activities.map(activity => console.log(activity))
    // console.log('Included:')
    // included.map(activity => console.log(activity))
    // console.log('Excluded:')
    // excluded.map(activity => console.log(activity))

    // console.log('Title:', description);
    // console.log('Destination:', destination);
    // console.log('Duration:', duration);
    // console.log('Dates:', dates);
    // console.log('Group size:', groupSize);
    // console.log('Price:', price);
    // console.log('Tour image:', tourImage);

    // console.log('Itineraries:')
    // itineraries.map(({day, subtitle, activities, image}) => {
    //   console.log('Day:', day);
    //   console.log('Subtitle:', subtitle);
    //   console.log('Image:', image);

    //   activities.map(activity => console.log('Itinerary activity', activity));
    // })

    const formData = new FormData(event.currentTarget);
    const activities = formData.getAll('activities');
    const excluded = formData.getAll('excluded');
    const included = formData.getAll('included')
    const description = formData.get('description');    
    const destination = formData.get('destination');
    const duration = formData.get('duration');
    const dates = formData.get('dates');
    const groupSize = formData.get('groupSize');
    const tourImage = formData.get('tourImage');
    const price = formData.get('price');
    const title = formData.get('title');
    

    console.log('itineraries', itineraries)
  }

  return (
    <Form
      className="flex w-full max-w-prose flex-col gap-4"
      onSubmit={submitForm}
    >
      <Field>
        <FieldLabel>Description</FieldLabel>
        <Textarea name="description" required value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description" />
      </Field>

      <Field name="activities" className="w-full">
        <FieldLabel>Activities</FieldLabel>

        {activities.map((value, index) => (
          <div key={index} className="flex gap-2 w-full">
            <Input
              value={value}
              onChange={(e) =>
                handleArrayChange(setActivities, index, e.target.value)
              }
              placeholder="Activity"
              required
            />

            <Button
              type="button"
              variant="destructive-outline"
              onClick={() => removeField(setActivities, index)}
            >
              Remove activity
            </Button>
          </div>
        ))}

        <Button type="button" onClick={() => addField(setActivities)}>
          Add Activity
        </Button>
      </Field>

      <Field className="w-full" name="included">
        <FieldLabel>What's included</FieldLabel>
        {included.map((value, index) => (
          <div key={index} className="flex gap-2 w-full">
            <Input
              required
              type="text"
              placeholder="Included"
              value={value}
              onChange={(e) => handleArrayChange(setIncluded, index, e.currentTarget.value)}
            />
            <Button onClick={() => removeField(setIncluded, index)} variant="destructive-outline">Remove item</Button>
          </div>
        ))}

        <Button onClick={() => addField(setIncluded)}>Add included item</Button>

      </Field>

      <Field name="excluded" className="w-full">
        <FieldLabel>What's excluded</FieldLabel>
        {excluded.map((value, index) =>
          <div key={index} className="flex gap-3 items-center w-full">
            <Input
              required
              placeholder="Excluded"
              value={value}
              onChange={(e) => handleArrayChange(setExcluded, index, e.currentTarget.value)}
              type="text"
            />
            <Button variant="destructive-outline">Remove item</Button>
          </div>
        )}
        <Button onClick={() => addField(setExcluded)}>Add excluded item</Button>

      </Field>

      {/* general info */}

      <h2 className="font-semibold text-lg py-2">General information</h2>

      <Field name="title">
        <FieldLabel>Title</FieldLabel>
        <Input required value={title} onChange={e => setTitle(e.currentTarget.value)} type="text" />
      </Field>

      <Field name="destination">
        <FieldLabel>Destination</FieldLabel>
        <Input required value={destination} onChange={e => setDestination(e.currentTarget.value)} type="text" />
      </Field>

      <Field name="duration">
        <FieldLabel>Duration</FieldLabel>
        <Input required value={duration} onChange={e => setDuration(e.currentTarget.value)} type="text" />
      </Field>

      <Field name="dates">
        <FieldLabel>Dates</FieldLabel>
        <Input required value={dates} onChange={e => setDates(e.currentTarget.value)} type="text" />
      </Field>

      <Field name="groupSize">
        <FieldLabel>Group size</FieldLabel>
        <Input required value={groupSize} onChange={e => setGroupSize(e.currentTarget.value)} type="text" />
      </Field>

      <Field name="price">
        <FieldLabel>Price</FieldLabel>
        <Input required value={price} onChange={e => setPrice(e.currentTarget.value)} type="text" />
      </Field>

      <Field name="tourImage">
        <FieldLabel>Add image</FieldLabel>
        <Input required onChange={(e) => {
          const file = e.currentTarget.files?.[0];
          file && setTourImage(file)
        }} type="file" accept="image/*" />
      </Field>

      {/* itinerary */}
      <h2 className="font-semibold text-lg py-2">Itinerary</h2>
      {itineraries.map(({ activities, subtitle, image }, itineraryIndex) => (
        <div key={itineraryIndex} className="flex flex-col gap-2">

          <div className="flex justify-between">
            <p className="font-medium text-md">Day {itineraryIndex + 1}</p>
            <Button variant="outline" onClick={() => removeItinerary(itineraryIndex)}>Remove itinerary</Button>
          </div>

          <Field name="subtitle">
            <FieldLabel>Subtitle</FieldLabel>
            <Input required onChange={(e) => { handleItinerarySubtitle(itineraryIndex, e.currentTarget.value) }} value={subtitle} type="text" />
          </Field>

          <Field name="itineraryActivities" className="w-full">
            <div key={itineraryIndex} className="w-full flex flex-col gap-2">
              {activities.map((activity, activityIndex) => (
                <div key={activityIndex} className="w-full flex flex-col gap-2">
                  <FieldLabel>Activities</FieldLabel>
                  <div className="flex gap-3 w-full">
                    <Input
                      required
                      type="text"
                      value={activity}
                      onChange={(e) => handleItineraryActivity(itineraryIndex, activityIndex, e.target.value)}
                    />
                    <Button onClick={() => removeItineraryActivityField(itineraryIndex, activityIndex)} variant="destructive-outline">Remove activity</Button>
                  </div>

                </div>
              ))}
              <Button onClick={() => addItineraryActivityField(itineraryIndex)} variant="default" className="w-fit">Add activity</Button>
            </div>
          </Field>


          <Field>
            <FieldLabel>Add image</FieldLabel>
            <Input
              required
              onChange={(e) => {
                const file = e.currentTarget.files?.[0]
                return file && handleItineraryImage(
                  itineraryIndex,
                  file)
              }}
              type="file" accept="image/*" />
          </Field>

        </div>
      ))}
      <Button variant="secondary" onClick={() => addItinerary(itineraries.length + 1)}>Add itinerary</Button>

      <Button loading={loading} type="submit">
        Submit
      </Button>
    </Form>
  );
}
