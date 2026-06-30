"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Dispatch, SetStateAction, SubmitEvent } from "react";
import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { toast } from 'sonner';
import { Loader2, PlusIcon } from "lucide-react";
import { Dialog, DialogContent } from "./ui/dialog";
import { SpinnerCustom } from "./spinner-custom";
import { useRouter } from "next/navigation";

type Itinerary = {
  activities: string[];
  subtitle: string;
  day: string;
  itineraryImage: File | null;
};

const initialItineraryData = (day: number) => [{
  activities: [''],
  subtitle: '',
  day: `Day ${day}`,
  itineraryImage: null
}]

export default function CreateTourForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined)

  const [description, setDescription] = useState<string>('');
  const [activities, setActivities] = useState<string[]>(['']);
  const [included, setIncluded] = useState<string[]>(['']);
  const [excluded, setExcluded] = useState<string[]>(['']);
  const [title, setTitle] = useState<string>('');
  const [destinationName, setDestinationName] = useState<string>('');
  const [dates, setDates] = useState<string>('');
  const [groupSize, setGroupSize] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [tourImage, setTourImage] = useState<File | null>(null);
  const [itineraries, setItineraries] = useState<Itinerary[]>(initialItineraryData(1));
  const [duration, setDuration] = useState<string>('');

  const [steps, setSteps] = useState<{
    destination: string;
    tour: string;
    itineraries: string;
  }>({
    destination: "Pending",
    tour: "Pending",
    itineraries: "Pending"
  })

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
      copy[itineraryId] = { ...copy[itineraryId], itineraryImage: file };
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

    try {
      setLoading(true);

      // create destination

      setSteps(prev => ({...prev, destination: "Creating destination"}));

      const destinationResult = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/destinations`, {
        method: 'POST',
        body: JSON.stringify({ destinationName })
      });

      const {
        data: destinationData,
        success: destinationSuccess,
        error: destinationError
      } = await destinationResult.json();

      if (!destinationSuccess) {
        setLoading(false);
        setError(destinationError);
        toast.error('Error occurred creating destination');
        console.log('Error creating destination:', destinationError);
        return;
      } else {
        setSteps(prev => ({...prev, destination: "Destination created successfully ✅"}))
        toast.success('Successfully created destination');
      }

      // create tour using destination id
      setSteps(prev => ({...prev, tour: "Creating tour"}))
      const { id: destinationId } = destinationData;

      if (!destinationId) {
        setError('Did not get destination ID');
        toast.error('Missing destination ID', { description: "Did not get ID from the created destination" });
        return;
      } else {
        console.log('Successfully retrieved destinationId', destinationId);
        toast.success('Successfully retrieved destinationID', { description: destinationId });
      }

      const tourFormData = new FormData();
      tourImage && tourFormData.append('tourImage', tourImage);
      tourFormData.append(
        'tour',
        JSON.stringify({
          description,
          duration,
          title,
          dates,
          groupSize,
          price,
          activities,
          excluded,
          included
        })
      )

      const url = new URL(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/destinations/${destinationId}/tours`);
      const tourResult = await fetch(url, {
        method: 'POST',
        body: tourFormData
      })

      const {
        data: tourData,
        success: tourSuccess,
        error: tourError
      } = await tourResult.json();

      if (!tourSuccess) {
        setLoading(false);
        setError(tourError);
        toast.error('Error occurred creating tour.', { description: tourError })
        console.log('Error creating tour', tourError);
        return;
      } else {
        setSteps(prev => ({...prev, tour: "Tour created successfully ✅"}))
        toast.success('Successfully created tour.')
      }

      // create itineraries
      setSteps(prev => ({...prev, itineraries: "Creating itineraries"}))
      const { id: tourId } = tourData;

      const itinerariesFormData = new FormData();

      for (const itinerary of itineraries) {
        if (itinerary.itineraryImage) {
          itinerariesFormData.append(
            "itineraryImages",
            itinerary.itineraryImage
          );
        }
      }

      itinerariesFormData.append(
        "itineraries",
        JSON.stringify(
          itineraries.map(
            ({ subtitle, day, activities }) => ({
              subtitle,
              day,
              activities,
            })
          )
        )
      );

      const itineraryRes = await fetch(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/destinations/${destinationId}/tours/${tourId}/itineraries`,
        {
          method: "POST",
          body: itinerariesFormData,
        }
      );

      const { success: itinerarySuccess, error: itineraryError } = await itineraryRes.json();

      if (!itinerarySuccess) {
        setError(itineraryError);
        toast.error('Error occurred creating itinerary');
        return;
      } else {
        setSteps(prev => ({...prev, itineraries: 'Itineraries created successfully ✅'}))
        setLoading(false);
        toast.success("Itineraries successfully created", {
          description: "New tour with destination and itineraries successfully created."
        })
      }

      router.push('/tours');

    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred"
      );
      toast.error("Failed to create tour", {
        description: "Service temporarily unavailable."
      })
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form
      className="flex w-full max-w-7xl mx-auto flex-col gap-4"
      onSubmit={submitForm}
    >
      <Field>
        <FieldLabel>Description</FieldLabel>
        <Textarea name="description" required value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description" />
      </Field>

      <Field className="w-full">
        <FieldLabel>Activities</FieldLabel>

        {activities.map((value, index) => (
          <div key={index} className="flex gap-2 w-full">
            <Input
              name="activities"
              value={value}
              onChange={(e) =>
                handleArrayChange(setActivities, index, e.target.value)
              }
              placeholder="Activity"
              required
            />

            <Button
              type="button"
              variant="destructive"
              onClick={() => removeField(setActivities, index)}
            >
              Remove activity
            </Button>
          </div>
        ))}

        <div className="w-fit">
          <Button
            type="button"
            onClick={() => addField(setActivities)}
          >
            <PlusIcon size={18} />
            Add Activity
          </Button>
        </div>
      </Field>

      <Field className="w-full" >
        <FieldLabel>What's included</FieldLabel>
        {included.map((value, index) => (
          <div key={index} className="flex gap-2 w-full">
            <Input
              name="included"
              required
              type="text"
              placeholder="Included"
              value={value}
              onChange={(e) => handleArrayChange(setIncluded, index, e.currentTarget.value)}
            />
            <Button onClick={() => removeField(setIncluded, index)}
              type="button" variant="destructive">Remove item</Button>
          </div>
        ))}

        <div className="w-fit">
          <Button type="button"
            onClick={() => addField(setIncluded)}><PlusIcon size={18} />Add included item</Button>
        </div>
      </Field>

      <Field className="w-full">
        <FieldLabel>What's excluded</FieldLabel>
        {excluded.map((value, index) =>
          <div key={index} className="flex gap-3 items-center w-full">
            <Input
              required
              name="excluded"
              placeholder="Excluded"
              value={value}
              onChange={(e) => handleArrayChange(setExcluded, index, e.currentTarget.value)}
              type="text"
            />
            <Button type="button" variant="destructive"
              onClick={() => removeField(setExcluded, index)}>Remove item</Button>
          </div>
        )}
        <div className="w-fit">
          <Button type="button"
            onClick={() => addField(setExcluded)}><PlusIcon size={18} />Add excluded item</Button>
        </div>
      </Field>

      {/* general info */}

      <h2 className="font-semibold text-lg py-2">General information</h2>

      <Field >
        <FieldLabel>Title</FieldLabel>
        <Input name="title" required value={title} onChange={e => setTitle(e.currentTarget.value)} type="text" />
      </Field>

      <Field >
        <FieldLabel>Destination</FieldLabel>
        <Input name="destination" required value={destinationName}
          onChange={e => setDestinationName(e.currentTarget.value)} type="text" />
      </Field>

      <Field >
        <FieldLabel>Duration</FieldLabel>
        <Input name="duration" required value={duration}
          onChange={e => setDuration(e.currentTarget.value)} type="text" />
      </Field>

      <Field >
        <FieldLabel>Dates</FieldLabel>
        <Input name="dates" required value={dates}
          onChange={e => setDates(e.currentTarget.value)} type="text" />
      </Field>

      <Field >
        <FieldLabel>Group size</FieldLabel>
        <Input name="groupSize" required value={groupSize}
          onChange={e => setGroupSize(e.currentTarget.value)} type="text" />
      </Field>

      <Field >
        <FieldLabel>Price</FieldLabel>
        <Input name="price" required value={price}
          onChange={e => setPrice(e.currentTarget.value)} type="text" />
      </Field>

      <Field >
        <FieldLabel>Add image</FieldLabel>
        <Input name="tourImage" required onChange={(e) => {
          const file = e.currentTarget.files?.[0];
          file && setTourImage(file)
        }} type="file" accept="image/*" />
      </Field>

      {/* itinerary */}
      <h2 className="font-semibold text-lg py-2">Itinerary</h2>
      {itineraries.map(({ activities, subtitle, itineraryImage }, itineraryIndex) => (
        <div key={itineraryIndex} className="flex flex-col gap-2">

          <div className="flex justify-between">
            <p className="font-medium text-md bg-green-600 px-2 rounded-md items-center flex text-black">Day {itineraryIndex + 1}</p>
            <Button type="button" variant="destructive" onClick={() => removeItinerary(itineraryIndex)}>Remove itinerary</Button>
          </div>

          <Field >
            <FieldLabel>Subtitle</FieldLabel>
            <Input name="subtitle" required
              onChange={(e) => { handleItinerarySubtitle(itineraryIndex, e.currentTarget.value) }}
              value={subtitle} type="text" />
          </Field>

          <Field className="w-full">
            <FieldLabel>Activities</FieldLabel>
            <div key={itineraryIndex} className="w-full flex flex-col gap-2">
              {activities.map((activity, activityIndex) => (
                <div key={activityIndex} className="w-full flex flex-col gap-2 justify-end">

                  <div className="flex gap-3 w-full">
                    <Input
                      name="itineraryActivities"
                      required
                      type="text"
                      value={activity}
                      onChange={(e) => handleItineraryActivity(itineraryIndex, activityIndex, e.target.value)}
                    />
                    <Button type="button"
                      onClick={() => removeItineraryActivityField(itineraryIndex, activityIndex)}
                      variant="destructive">Remove activity</Button>
                  </div>

                </div>
              ))}
              <Button type="button" onClick={() => addItineraryActivityField(itineraryIndex)}
                variant="default" className="w-fit">Add activity<PlusIcon size={18} /></Button>
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
      <Button type="button" variant="secondary" onClick={() => addItinerary(itineraries.length + 1)}>Add itinerary</Button>

      <Button disabled={loading} type="submit">
        Submit
      </Button>
      {loading && (
        <Dialog open={loading}>
          <DialogContent
            className="sm:max-w-sm"
            onInteractOutside={(e) => e.preventDefault()}
            showCloseButton={false}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            <div className="flex flex-col items-center gap-4 py-6">
              <SpinnerCustom progress={steps} />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Form>
  );
}
