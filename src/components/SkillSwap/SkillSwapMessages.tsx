import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Send, User, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const messageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty"),
});

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  recipient_id: string;
  read_at?: string;
  sender_profile?: {
    name: string;
    avatar_url?: string;
  };
  recipient_profile?: {
    name: string;
    avatar_url?: string;
  };
}

interface SwapOffer {
  id: string;
  message: string;
  status: string;
  created_at: string;
  proposer_id: string;
  proposer_profile?: {
    name: string;
    avatar_url?: string;
  };
  offering_skill: {
    name: string;
  };
  needing_skill: {
    name: string;
  };
  proposed_hours: number;
  proposed_delivery_time: string;
  swap_listings: {
    title: string;
    user_id: string;
  };
}

interface SkillSwapMessagesProps {
  user: any;
}

export const SkillSwapMessages: React.FC<SkillSwapMessagesProps> = ({ user }) => {
  const [offers, setOffers] = useState<SwapOffer[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [conversationMessages, setConversationMessages] = useState<Message[]>([]);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const { toast } = useToast();

  const messageForm = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  useEffect(() => {
    if (user) {
      fetchOffers();
      fetchMessages();
    }
  }, [user]);

  const fetchOffers = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("swap_offers")
      .select(`
        id,
        message,
        status,
        created_at,
        proposer_id,
        proposed_hours,
        proposed_delivery_time,
        offering_skill:skills!swap_offers_offering_skill_id_fkey (
          name
        ),
        needing_skill:skills!swap_offers_needing_skill_id_fkey (
          name
        ),
        swap_listings (
          title,
          user_id
        )
      `)
      .or(`proposer_id.eq.${user.id},swap_listings.user_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching offers:", error);
      return;
    }

    // Fetch profiles for offers
    if (data && data.length > 0) {
      const proposerIds = [...new Set(data.map(offer => offer.proposer_id))];
      
      const { data: profiles } = await supabase
        .from("user_profiles")
        .select("user_id, name, avatar_url")
        .in("user_id", proposerIds);

      const enrichedOffers = data.map(offer => ({
        ...offer,
        proposer_profile: profiles?.find(p => p.user_id === offer.proposer_id) || null,
      }));

      setOffers(enrichedOffers);
    }
  };

  const fetchMessages = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("messages")
      .select("sender_id, recipient_id")
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching messages:", error);
      return;
    }

    // Get unique conversation partners
    const conversationPartners = new Set<string>();
    data?.forEach(message => {
      if (message.sender_id !== user.id) {
        conversationPartners.add(message.sender_id);
      }
      if (message.recipient_id !== user.id) {
        conversationPartners.add(message.recipient_id);
      }
    });

    // Just track that we have messages for now
    // setMessages(data || []);
  };

  const fetchConversationMessages = async (partnerId: string) => {
    if (!user) return;

    const { data, error } = await supabase
      .from("messages")
      .select(`
        id,
        content,
        created_at,
        sender_id,
        recipient_id,
        read_at
      `)
      .or(`and(sender_id.eq.${user.id},recipient_id.eq.${partnerId}),and(sender_id.eq.${partnerId},recipient_id.eq.${user.id})`)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching conversation messages:", error);
      return;
    }

    // Fetch profiles
    const { data: profiles } = await supabase
      .from("user_profiles")
      .select("user_id, name, avatar_url")
      .in("user_id", [user.id, partnerId]);

    const enrichedMessages = data?.map(message => ({
      ...message,
      sender_profile: profiles?.find(p => p.user_id === message.sender_id) || null,
      recipient_profile: profiles?.find(p => p.user_id === message.recipient_id) || null,
    })) || [];

    setConversationMessages(enrichedMessages);

    // Mark messages as read
    await supabase
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .eq("sender_id", partnerId)
      .eq("recipient_id", user.id)
      .is("read_at", null);
  };

  const sendMessage = async (values: z.infer<typeof messageSchema>) => {
    if (!user || !selectedConversation) return;

    const { error } = await supabase
      .from("messages")
      .insert({
        sender_id: user.id,
        recipient_id: selectedConversation,
        content: values.content,
      });

    if (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      return;
    }

    messageForm.reset();
    fetchConversationMessages(selectedConversation);
    toast({
      title: "Success",
      description: "Message sent successfully!",
    });
  };

  const acceptOffer = async (offerId: string) => {
    const { error } = await supabase
      .from("swap_offers")
      .update({ status: "accepted" })
      .eq("id", offerId);

    if (error) {
      console.error("Error accepting offer:", error);
      return;
    }

    fetchOffers();
    toast({
      title: "Success",
      description: "Offer accepted! You can now coordinate the details.",
    });
  };

  const rejectOffer = async (offerId: string) => {
    const { error } = await supabase
      .from("swap_offers")
      .update({ status: "rejected" })
      .eq("id", offerId);

    if (error) {
      console.error("Error rejecting offer:", error);
      return;
    }

    fetchOffers();
    toast({
      title: "Offer rejected",
      description: "The offer has been declined.",
    });
  };

  const getOfferStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">Pending</Badge>;
      case "accepted":
        return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">Accepted</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">Rejected</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Swap Offers Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Swap Offers
          </CardTitle>
        </CardHeader>
        <CardContent>
          {offers.length > 0 ? (
            <div className="space-y-4">
              {offers.map((offer) => (
                <div key={offer.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={offer.proposer_profile?.avatar_url} />
                        <AvatarFallback>
                          {offer.proposer_profile?.name?.substring(0, 2).toUpperCase() || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{offer.proposer_profile?.name || "Anonymous"}</p>
                        <p className="text-sm text-muted-foreground">
                          For: {offer.swap_listings.title}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getOfferStatusBadge(offer.status)}
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(offer.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Offering: {offer.offering_skill.name}</p>
                        <p className="text-muted-foreground">Hours: {offer.proposed_hours}</p>
                      </div>
                      <div>
                        <p className="font-medium">Needs: {offer.needing_skill.name}</p>
                        <p className="text-muted-foreground">Timeline: {offer.proposed_delivery_time}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm">{offer.message}</p>

                  {offer.status === "pending" && offer.swap_listings.user_id === user.id && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => acceptOffer(offer.id)}>
                        Accept
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => rejectOffer(offer.id)}>
                        Decline
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => {
                          setSelectedConversation(offer.proposer_id);
                          setMessageDialogOpen(true);
                          fetchConversationMessages(offer.proposer_id);
                        }}
                      >
                        Message
                      </Button>
                    </div>
                  )}

                  {(offer.status === "accepted" || offer.proposer_id === user.id) && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        const partnerId = offer.proposer_id === user.id ? 
                          offer.swap_listings.user_id : offer.proposer_id;
                        setSelectedConversation(partnerId);
                        setMessageDialogOpen(true);
                        fetchConversationMessages(partnerId);
                      }}
                    >
                      Message
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No swap offers yet. Create a listing or propose swaps to get started!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Message Dialog */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent className="max-w-lg max-h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Messages</DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="flex-1 max-h-[400px] p-4">
            {conversationMessages.length > 0 ? (
              <div className="space-y-4">
                {conversationMessages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${
                      message.sender_id === user.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    } rounded-lg p-3`}>
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender_id === user.id 
                          ? 'text-primary-foreground/70' 
                          : 'text-muted-foreground'
                      }`}>
                        {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No messages yet. Start the conversation!
              </p>
            )}
          </ScrollArea>

          <Form {...messageForm}>
            <form onSubmit={messageForm.handleSubmit(sendMessage)} className="flex gap-2">
              <FormField
                control={messageForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input 
                        placeholder="Type your message..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};